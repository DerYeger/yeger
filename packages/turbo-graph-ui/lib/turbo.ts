import fs from 'node:fs/promises'
import path from 'node:path'

import { execa } from 'execa'
import type { Result } from 'resumon'
import { err, ok } from 'resumon'

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
    return ok({ nodes: [], edges: [] })
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
      args.push(`--filter=${filter}`)
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
  package: string
  task: string
}

export interface TurboEdge {
  source: string
  sourceTask: string
  target: string
  targetTask: string
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
    package: task.package,
    task: task.task,
  }))
  const validTasks = new Set(tasks.map(({ taskId }) => taskId))

  const edges: TurboEdge[] = tasks.flatMap(({ taskId, dependencies }) =>
    dependencies
      .filter((dependency) => validTasks.has(dependency))
      .map((dependency) => ({
        source: dependency,
        sourceTask: dependency.substring(dependency.indexOf('#') + 1),
        target: taskId,
        targetTask: taskId.substring(taskId.indexOf('#') + 1),
      })),
  )
  return { nodes, edges }
}
