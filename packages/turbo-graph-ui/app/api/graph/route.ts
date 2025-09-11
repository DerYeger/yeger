import type { NextRequest } from 'next/server'
import { getGraph } from '../../../lib/turbo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { tasks?: string[], filter?: string }
    const tasks = (body.tasks ?? []).filter(Boolean)
    const filter = body.filter
    const result = await getGraph(tasks, filter)
    if (result.isError) {
      const error = result.getError()
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json(result.get())
  } catch (err) {
    return Response.json({ error: (err as Error)?.message ?? 'graph error' }, { status: 500 })
  }
}
