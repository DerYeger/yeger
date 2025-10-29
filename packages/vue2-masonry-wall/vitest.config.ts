import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { configuration } from '@yeger/vitest-utils'

export default defineConfig({
  plugins: [vue()],
  test: {
    ...configuration.coverage,
    ...configuration.idempotent,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})
