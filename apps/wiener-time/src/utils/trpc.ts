import process from 'process'

import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'

import type { AppRouter } from '../server/trpc/router'

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  } // browser should use relative url
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  } // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      url: `${getBaseUrl()}/api/trpc`,
      links: [httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: superjson,
      })],
    }
  },
  ssr: false,
  transformer: superjson,
})
