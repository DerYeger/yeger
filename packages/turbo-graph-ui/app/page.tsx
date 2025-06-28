import type { Metadata } from 'next'

import { Graph } from '../components/Graph'
import { getAllTasks } from '../lib/turbo'
import { TaskInput, FilterInput } from '../components/GraphInputs'

export const metadata: Metadata = {
  title: 'Turbo Graph',
  description: 'Interactive visualization of Turborepo task graphs.',
  icons: ['/favicon.ico'],
}

export interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(
  { searchParams }: Props,
) {
  const tasks = await getAllTasks()
  const awaitedSearchParams = await searchParams
  const rawSelectedTasks = awaitedSearchParams?.tasks
  const selectedTasks = Array.isArray(rawSelectedTasks)
    ? rawSelectedTasks
    : rawSelectedTasks?.replaceAll(',', ' ')?.split(' ') ?? []
  const filter = awaitedSearchParams?.filter

  if (filter && Array.isArray(filter)) {
    throw new Error(`Unsupported filter ${filter}`)
  }

  return (
    <>
      <div className="absolute inset-y-0 left-0 z-10 flex max-h-screen w-64 flex-col gap-4 overflow-hidden p-4">
        <FilterInput />
        <div className="grow overflow-hidden">
          <TaskInput tasks={tasks} />
        </div>
      </div>
      <Graph tasks={tasks} selectedTasks={selectedTasks} filter={filter} />
    </>
  )
}
