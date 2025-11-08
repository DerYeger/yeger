import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'

export default defineConfig({
  test: {
    ...defineTestConfig({
      browser: playwright(),
    }),
    setupFiles: ['./test/setup.ts'],
  },
})
