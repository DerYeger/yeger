import { useQuery } from '@tanstack/react-query'
import type { TurboGraph } from './turbo'

export function useGraphQuery(params: { tasks: string[], filter?: string | undefined }) {
  const { tasks, filter } = params
  return useQuery<TurboGraph, Error>({
    queryKey: ['graph', tasks.sort().join(' '), filter ?? ''],
    placeholderData: (previous) => previous,
    staleTime: 0,
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, filter }),
      })
      if (!res.ok) {
        const t = await res.json().catch(() => ({} as any))
        const msg = t?.error || `Graph fetch failed (${res.status})`
        throw new Error(msg)
      }
      return res.json()
    },
  })
}
