// src/server/trpc/router/index.ts
import { t } from '../utils'

import { monitorRouter } from './monitor'

export const appRouter = t.router({
  monitor: monitorRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
