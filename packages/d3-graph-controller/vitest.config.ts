import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: defineTestConfig({
    browser: playwright(),
  }),
})
