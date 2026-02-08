import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { defineTestConfig } from '@yeger/vitest-utils'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'browser',
          include: ['test/{browser,integration}.test.ts'],
          ...defineTestConfig({ browser: playwright() }),
        },
      },
      {
        test: {
          name: 'node',
          include: ['test/node.test.ts'],
          ...defineTestConfig(),
        },
      },
    ],
    sequence: {
      shuffle: false,
    },
  },
})
