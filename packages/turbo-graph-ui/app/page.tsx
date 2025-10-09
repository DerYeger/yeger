import type { Metadata } from 'next'

import { Graph } from '../components/Graph'
import { getAllTasks } from '../lib/turbo'
import { TaskInput, FilterInput, RunControls } from '../components/ParameterInputs'

export const metadata: Metadata = {
  title: 'Turbo Graph',
  description: 'Interactive visualization of Turborepo task graphs.',
  icons: ['/favicon.ico'],
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  const tasks = await getAllTasks()

  return (
    <>
      <div id="sidebar" className="absolute inset-y-0 left-0 z-10 flex max-h-screen w-(--sidebar-width) flex-col gap-4 overflow-hidden p-4">
        <RunControls />
        <FilterInput />
        <div className="grow overflow-hidden">
          <TaskInput tasks={tasks} />
        </div>
      </div>
      <Graph tasks={tasks} />
    </>
  )
}
