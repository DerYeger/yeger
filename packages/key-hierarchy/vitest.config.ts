import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { configuration } from '@yeger/vitest-utils'

export default defineConfig({
  test: {
    ...configuration.coverage,
    ...configuration.idempotent,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: ['./test/setup.ts'],
  },
})
