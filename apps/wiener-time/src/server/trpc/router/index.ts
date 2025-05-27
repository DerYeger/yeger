// src/server/trpc/router/index.ts
import { t } from '../utils'
import { authRouter } from './auth'
import { monitorRouter } from './monitor'
import { favoriteRouter } from './favorite'

export const appRouter = t.router({
  auth: authRouter,
  favorite: favoriteRouter,
  monitor: monitorRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
