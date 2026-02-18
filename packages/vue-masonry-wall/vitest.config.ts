import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: defineTestConfig({
    browser: playwright(),
  }),
})
