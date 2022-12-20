import { defineConfig } from 'vitest/config'

import { libPlugin } from './src'

export default defineConfig({
  plugins: [
    libPlugin({ entry: 'src/index.ts', formats: ['es'], name: 'index' }),
  ],
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
