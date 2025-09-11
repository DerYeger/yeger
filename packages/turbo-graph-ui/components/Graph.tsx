'use client'

import { FlowGraph } from './FlowGraph'
import { useGraphQuery } from '../lib/useGraphQuery'
import { useGraphSettings } from '../lib/utils'

export function Graph({ tasks }: { tasks: string[] }) {
  const { getParameter } = useGraphSettings()
  const tasksParam = getParameter('tasks') ?? ''
  const selectedTasks = tasksParam.length ? tasksParam.split(' ').filter(Boolean) : []
  const filterParam = getParameter('filter') ?? undefined

  const { data, error, isLoading } = useGraphQuery({
    tasks: selectedTasks,
    ...(filterParam !== undefined ? { filter: filterParam } : {}),
  })

  if (isLoading) {
    return <div className="flex size-full items-center justify-center p-4 pl-(--sidebar-width)"><span className="text-sm text-neutral-400">Loading graph…</span></div>
  }
  if (error) {
    return (
      <div className="flex size-full items-center justify-center p-4 pl-(--sidebar-width)">
        <code className="text-justify text-sm text-red-500">{error.message}</code>
      </div>
    )
  }
  const graph = data!
  return (
    <div className="size-full">
      <FlowGraph graph={graph} tasks={tasks} />
    </div>
  )
}
