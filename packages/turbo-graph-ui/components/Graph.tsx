import { Stream } from '@yeger/streams'

import { getEdgeGradient, getTaskColorVar } from '../lib/flow'
import { getGraph } from '../lib/turbo'

import { FlowGraph } from './FlowGraph'

export interface GraphProps {
  tasks: string[]
  filter?: string
}

export async function Graph({ tasks, filter }: GraphProps) {
  const graphResult = await getGraph(tasks, filter)

  if (graphResult.isError) {
    const error = graphResult.getError()
    const searchTerm = 'error preparing engine:'
    const searchIndex = error.message.lastIndexOf(searchTerm)
    const message =
      searchIndex > 0
        ? error.message.substring(searchIndex + searchTerm.length)
        : error.message
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <code className="text-justify text-sm text-red-500">{message}</code>
      </div>
    )
  }

  const graph = graphResult.get()
  const uniqueTasks = Stream.from(graph.nodes)
    .map(({ task }) => task)
    .toSet()
  const edgeGradients = Stream.from(uniqueTasks).flatMap((source) =>
    Stream.from(uniqueTasks).map((target) => ({
      id: getEdgeGradient(source, target),
      sourceColor: `var(${getTaskColorVar(source)})`,
      targetColor: `var(${getTaskColorVar(target)})`,
    })),
  )

  return (
    <div className="h-full w-full">
      <FlowGraph graph={graph} uniqueTasks={uniqueTasks}>
        <svg>
          <defs>
            {edgeGradients.map(({ id, sourceColor, targetColor }) => (
              <linearGradient
                id={id}
                key={id}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor={sourceColor} />
                <stop offset="1" stopColor={targetColor} />
              </linearGradient>
            ))}
          </defs>
        </svg>
      </FlowGraph>
    </div>
  )
}
