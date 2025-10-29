import { defineConfig } from 'vitest/config'
import { configuration } from '@yeger/vitest-utils'

export default defineConfig({
  test: {
    ...configuration.coverage,
    ...configuration.idempotent,
    sequence: {
      shuffle: false,
    },
  },
})
