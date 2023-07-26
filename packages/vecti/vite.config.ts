import process from 'node:process'

import { defineConfig } from 'vite'
import { library } from 'vite-plugin-lib'

export default defineConfig({
  plugins: [
    library({
      entry: 'src/vecti.ts',
      formats: ['es', 'umd'],
      name: 'vecti',
    }),
  ],
  test: {
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
