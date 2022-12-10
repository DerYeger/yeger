import * as path from 'path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: 'src/**',
      outputDir: 'dist/types',
      staticImport: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['es', 'umd'],
      name: '@yeger/debounce',
      fileName: (format) => `debounce.${format}.js`,
    },
  },
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
