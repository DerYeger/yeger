import type { Metadata } from 'next'

import { Graph } from '../components/Graph'

export const metadata: Metadata = {
  title: 'Turbo Graph',
  description: 'Interactive visualization of Turborepo task graphs.',
  icons: ['/favicon.ico'],
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const rawTasks = searchParams?.tasks
  const tasks = Array.isArray(rawTasks)
    ? rawTasks
    : rawTasks?.replaceAll(',', ' ')?.split(' ') ?? ['build']
  const filter = searchParams?.filter

  if (filter && Array.isArray(filter)) {
    throw new Error(`Unsupported filter ${filter}`)
  }

  return <Graph tasks={tasks} filter={filter} />
}
