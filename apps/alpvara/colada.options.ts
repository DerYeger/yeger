import type { PiniaColadaOptions } from '@pinia/colada'

export default {
  queryOptions: {
    gcTime: false,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
  },
} satisfies PiniaColadaOptions
