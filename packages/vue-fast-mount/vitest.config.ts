import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'
import { defineConfig } from 'vitest/config'
import { vueFastMount } from 'vue-fast-mount/plugin'

export default defineConfig({
  plugins: [vue(), vueFastMount()],
  test: defineTestConfig(
    {},
    {
      projects: [
        {
          extends: true,
          test: defineTestConfig(
            {
              browser: playwright(),
            },
            {
              exclude: ['test/plugin.test.ts'],
              silent: false,
            },
          ),
        },
        {
          extends: true,
          test: {
            environment: 'node',
            include: ['test/plugin.test.ts'],
          },
        },
      ],
    },
  ),
})
