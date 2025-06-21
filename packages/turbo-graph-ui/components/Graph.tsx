import { Stream } from '@yeger/streams'

import { getGraph } from '../lib/turbo'

import { FlowGraph } from './FlowGraph'

export interface GraphProps {
  tasks: string[]
  filter: string | undefined
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
      <div className="flex size-full items-center justify-center p-4">
        <code className="text-justify text-sm text-red-500">{message}</code>
      </div>
    )
  }

  const graph = graphResult.get()
  const uniqueTasks = Stream.from(graph.nodes)
    .map(({ task }) => task)
    .toSet()

  return (
    <div className="size-full">
      <FlowGraph graph={graph} uniqueTasks={uniqueTasks} />
    </div>
  )
}
