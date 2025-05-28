import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

export const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})
