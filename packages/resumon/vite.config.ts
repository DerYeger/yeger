import process from 'node:process'

import { defineConfig } from 'vite'
import { library } from 'vite-plugin-lib'

import Meta from './package.json'

export default defineConfig({
  plugins: [
    library({
      entry: 'src/main.ts',
      formats: ['es', 'umd'],
      name: Meta.name,
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
