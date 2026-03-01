import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'
import { defineConfig } from 'vitest/config'
import { vueFastMount } from 'vue-fast-mount/plugin'

export default defineConfig({
  test: defineTestConfig(
    {},
    {
      projects: [
        {
          plugins: [vue(), vueFastMount()],
          test: defineTestConfig(
            {
              browser: playwright(),
            },
            {
              include: ['test/runtime/**/*.test.ts'],
              name: 'runtime',
              silent: false,
            },
          ),
        },
        {
          extends: true,
          test: defineTestConfig(
            {},
            {
              environment: 'node',
              name: 'plugin',
              include: ['test/plugin/**/*.test.ts'],
            },
          ),
        },
      ],
    },
  ),
})
