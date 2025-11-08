import { defineConfig } from 'vitest/config'
import { defineTestConfig } from '@yeger/vitest-utils'

export default defineConfig({
  test: defineTestConfig(),
})
