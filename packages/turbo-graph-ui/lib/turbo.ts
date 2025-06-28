import fs from 'node:fs/promises'
import path from 'node:path'

import { execa } from 'execa'
import type { Result } from 'resumon'
import { err, ok } from 'resumon'
import { getPackages } from '@manypkg/get-packages'
import type { Package } from '@manypkg/get-packages'

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
  const { rootPackage } = await getPackages(dir)
  const rootPackageName = rootPackage?.packageJson.name ?? '<root>'

  const stdout = await executeCommand(dir, filteredTasks, filter)
  return stdout.map((output) => createGraph(output, rootPackageName))
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
  const turboConfig = files.find((file) => file === 'turbo.json' || file === 'turbo.jsonc')
  const continueSearch = () => findTurboConfig(`..${path.sep}${currentPath}`)
  if (!turboConfig) {
    return continueSearch()
  }
  const file = `${currentPath}${path.sep}${turboConfig}`
  const config = await readTurboConfig(file)

  if (Array.isArray(config.extends)) {
    // We have only found a package-level config
    return continueSearch()
  }
  return { dir: currentPath, config }
}

export interface TurboNode {
  id: string
  packageName: string
  packageDir: string | undefined
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
  tasks: TurboCLITask[]
}

export interface TurboCLITask {
  taskId: string
  task: string
  package?: string
  inputs: unknown
  outputs: unknown[]
  directory?: string
  dependencies: string[]
  dependents: string[]
  command: string
  framework: string
}

function createGraph(input: string, rootPackageName: string): TurboGraph {
  const data = JSON.parse(input) as TurboCLIJson
  const tasks = data.tasks.filter(({ command }) => command !== '<NONEXISTENT>')

  const getPackageName = (task: TurboCLITask) => {
    if (task.package === '//') {
      return rootPackageName
    }
    return task.package ?? rootPackageName
  }

  const nodes: TurboNode[] = tasks.map((task) => ({
    id: task.taskId,
    packageName: getPackageName(task),
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
    const turboConfig = await readTurboConfig(`${packageDir}${path.sep}turbo.json`)
    return Object.keys(turboConfig?.tasks ?? {})
  } catch {
    return []
  }
}

async function readTurboConfig(file: string) {
  const contents = await fs.readFile(file, { encoding: 'utf8' })
  try {
    return JSON.parse(contents)
  } catch {
    const jsoncParser = await import('jsonc-parser')
    return jsoncParser.parse(contents, undefined, { allowTrailingComma: true })
  }
}
