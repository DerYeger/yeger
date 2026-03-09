import { defineVitestProject } from '@nuxt/test-utils/config'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
    },
    projects: [
      {
        test: defineTestConfig(
          {},
          {
            name: 'unit',
            include: ['test/unit/**/*.test.ts'],
            environment: 'node',
          },
        ),
      },
      await defineVitestProject({
        test: defineTestConfig(
          {
            browser: playwright(),
          },
          {
            name: 'nuxt',
            include: ['test/nuxt/**/*.test.ts'],
            environment: 'nuxt',
          },
        ),
      }),
    ],
  },
})
