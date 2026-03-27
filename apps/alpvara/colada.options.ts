import type { PiniaColadaOptions } from '@pinia/colada'
import { PiniaColadaCachePersister } from '@pinia/colada-plugin-cache-persister'

const SCHEMA_VERSION = 1

const options: PiniaColadaOptions = {
  plugins: [
    PiniaColadaCachePersister({
      key: `alpvara-colada-cache-v${SCHEMA_VERSION}`,
    }),
  ],
  queryOptions: {
    gcTime: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  },
}

export default options
