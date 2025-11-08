import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'

export default defineConfig({
  plugins: [vue()],
  test: defineTestConfig({
    browser: playwright(),
  }),
})
