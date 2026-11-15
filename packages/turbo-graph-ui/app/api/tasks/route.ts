import type { NextRequest } from 'next/server'

import { isAuthorizedRequest, unauthorizedResponse } from '../../../lib/auth'
import { getAllTasks } from '../../../lib/turbo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAuthorizedRequest(req)) {
    return unauthorizedResponse()
  }
  try {
    return Response.json(await getAllTasks())
  } catch (err) {
    return Response.json({ error: (err as Error)?.message ?? 'tasks error' }, { status: 500 })
  }
}
