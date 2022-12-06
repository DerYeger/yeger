// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import path from 'fs/promises'

import { execa } from 'execa'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  dir: string
  config: Config
}

interface Config {
  pipeline: Record<string, unknown>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TurboGraph>
) {
  const { dir, config } = await findTurboConfig()
  const tasks = getTask(config)
  const stdout = await executeCommand(tasks, dir)
  const graph = await processResult(stdout)
  res.status(200).json(graph)
}

async function executeCommand(tasks: string[], dir: string): Promise<string> {
  // TODO: Get .bin dir location from package manager
  const { stdout } = await execa(
    `node_modules/.bin/turbo`,
    ['run', ...tasks, '--graph'],
    {
      cwd: dir,
    }
  )
  return stdout
}

function getTask(config: Config): string[] {
  const pipeline = Object.keys(config.pipeline).map((entry) => {
    if (!entry.includes('#')) {
      return entry
    }
    return entry.substring(entry.indexOf('#') + 1)
  })

  return [...new Set(pipeline)]
}

async function findTurboConfig(currentPath = '.'): Promise<Data> {
  const files = await path.readdir(currentPath)
  const turboConfig = files.find((file) => file === 'turbo.json')
  if (!turboConfig) {
    return findTurboConfig(`../${currentPath}`)
  }
  const file = `${currentPath}/${turboConfig}`
  const buffer = await path.readFile(file)
  const config = JSON.parse(buffer.toString())
  return { dir: currentPath, config }
}

export interface TurboNode {
  id: string
  workspace: string
  task: string
}

export interface TurboEdge {
  source: string
  target: string
}

export interface TurboGraph {
  nodes: TurboNode[]
  edges: TurboEdge[]
}

async function processResult(input: string): Promise<TurboGraph> {
  const edges: TurboEdge[] = input
    .split('\n')
    .filter((line) => line.includes('->') && !line.includes('___ROOT___'))
    .map((line) => line.substring(line.indexOf('"') + 1, line.lastIndexOf('"')))
    .map((line) => {
      const [source, target] = line.split('" -> "', 2)
      return { source, target }
    })
  const nodes: TurboNode[] = [...new Set(edges.flatMap(Object.values))].map(
    (id) => {
      const splitIndex = id.lastIndexOf('#')
      const workspace = id.substring(0, splitIndex).replace('[root] ', '')
      const task = id.substring(splitIndex + 1, id.length)
      return {
        id,
        workspace,
        task,
      }
    }
  )
  return { nodes, edges }
}
