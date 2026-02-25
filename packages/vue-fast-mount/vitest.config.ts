import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'
import { defineConfig } from 'vitest/config'

import { vueFastMount } from './src/plugin'

export default defineConfig({
  plugins: [vue(), vueFastMount()],
  test: defineTestConfig(
    {
      browser: playwright(),
    },
    {
      silent: false,
    },
  ),
})
