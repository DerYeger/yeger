import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'

export default defineConfig({
  test: {
    projects: [
      {
        test: defineTestConfig(
          { browser: playwright() },
          {
            name: 'browser',
            include: ['test/{browser,integration}.test.ts'],
          },
        ),
      },
      {
        test: defineTestConfig(
          {},
          {
            name: 'node',
            include: ['test/node.test.ts'],
          },
        ),
      },
    ],
    sequence: {
      shuffle: false,
    },
  },
})
