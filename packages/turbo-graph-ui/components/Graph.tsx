import { getGraph } from '../lib/turbo'

import { FlowGraph } from './FlowGraph'

export interface GraphProps {
  tasks: string[]
  selectedTasks: string[]
  filter: string | undefined
}

export async function Graph({ tasks, selectedTasks, filter }: GraphProps) {
  const graphResult = await getGraph(selectedTasks, filter)

  if (graphResult.isError) {
    const error = graphResult.getError()
    const searchTerm = 'error preparing engine:'
    const searchIndex = error.message.lastIndexOf(searchTerm)
    const message =
      searchIndex > 0
        ? error.message.substring(searchIndex + searchTerm.length)
        : error.message
    return (
      <div className="flex size-full items-center justify-center p-4 pl-[256px]">
        <code className="text-justify text-sm text-red-500">{message}</code>
      </div>
    )
  }

  const graph = graphResult.get()

  return (
    <div className="size-full">
      <FlowGraph graph={graph} tasks={tasks} />
    </div>
  )
}
