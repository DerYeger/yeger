import fs from 'node:fs/promises'
import path from 'node:path'

import { execa } from 'execa'
import type { Result } from 'resumon'
import { err, ok } from 'resumon'
import { getPackages, type Package } from '@manypkg/get-packages'

interface Data {
  dir: string
  config: Config
}

interface Config {
  pipeline: Record<string, unknown>
}

export async function getGraph(
  tasks: string[],
  filter?: string,
): Promise<Result<TurboGraph, Error>> {
  const filteredTasks = tasks.filter(Boolean)
  if (filteredTasks.length === 0) {
    const emptyGraph: TurboGraph = { nodes: [], edges: [] }
    return ok(emptyGraph)
  }
  const { dir } = await findTurboConfig()
  const stdout = await executeCommand(dir, filteredTasks, filter)
  return stdout.map(createGraph)
}

async function executeCommand(
  dir: string,
  tasks: string[],
  filter?: string,
): Promise<Result<string, Error>> {
  // TODO: Get .bin dir location from package manager
  try {
    const args = ['run', ...tasks, '--concurrency=100%', '--dry=json']
    if (filter) {
      const filterParts = filter.split(',')
      for (const part of filterParts) {
        args.push(`--filter=${part.trim()}`)
      }
    }
    const { stdout } = await execa(
      `node_modules${path.sep}.bin${path.sep}turbo`,
      args,
      {
        cwd: dir,
      },
    )
    return ok(stdout)
  } catch (error) {
    return err(error as Error)
  }
}

async function findTurboConfig(currentPath = '.'): Promise<Data> {
  const files = await fs.readdir(currentPath)
  const turboConfig = files.find((file) => file === 'turbo.json')
  if (!turboConfig) {
    return findTurboConfig(`..${path.sep}${currentPath}`)
  }
  const file = `${currentPath}${path.sep}${turboConfig}`
  const buffer = await fs.readFile(file)
  const config = JSON.parse(buffer.toString())
  return { dir: currentPath, config }
}

export interface TurboNode {
  id: string
  packageName: string
  packageDir: string
  task: string
  framework: string | undefined
}

export interface TurboEdge {
  source: string
  sourceTask: string
  sourceWorkspace: string
  target: string
  targetTask: string
  targetWorkspace: string
}

export interface TurboGraph {
  nodes: TurboNode[]
  edges: TurboEdge[]
}

export interface TurboCLIJson {
  tasks: {
    taskId: string
    task: string
    package: string
    inputs: unknown
    outputs: unknown[]
    directory: string
    dependencies: string[]
    dependents: string[]
    command: string
    framework: string
  }[]
}

function createGraph(input: string): TurboGraph {
  const data = JSON.parse(input) as TurboCLIJson
  const tasks = data.tasks.filter(({ command }) => command !== '<NONEXISTENT>')

  const nodes: TurboNode[] = tasks.map((task) => ({
    id: task.taskId,
    packageName: task.package,
    packageDir: task.directory,
    task: task.task,
    framework: task.framework,
  }))
  const validTasks = new Set(tasks.map(({ taskId }) => taskId))

  const edges: TurboEdge[] = tasks.flatMap(({ taskId, dependencies }) =>
    dependencies
      .filter((dependency) => validTasks.has(dependency))
      .map((dependency) => ({
        source: dependency,
        sourceTask: dependency.substring(dependency.indexOf('#') + 1),
        sourceWorkspace: dependency.substring(0, dependency.indexOf('#')),
        target: taskId,
        targetTask: taskId.substring(taskId.indexOf('#') + 1),
        targetWorkspace: taskId.substring(0, taskId.indexOf('#')),
      })),
  )
  return { nodes, edges }
}

export async function getAllTasks() {
  const { dir } = await findTurboConfig()
  const { packages, rootPackage } = await getPackages(dir)
  if (rootPackage) {
    packages.push(rootPackage)
  }
  const tasks = await Promise.all(packages.map(getPackageTasks))
  return [...new Set(tasks.flat())]
    .map((t) => t.replace('//#', ''))
    .toSorted()
}

async function getPackageTasks({ dir: packageDir }: Package) {
  try {
    const turboConfig = JSON.parse(await fs.readFile(`${packageDir}${path.sep}turbo.json`, { encoding: 'utf-8' }))
    return Object.keys(turboConfig?.tasks ?? {})
  } catch {
    return []
  }
}
