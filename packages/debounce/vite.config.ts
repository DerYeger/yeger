/// <reference types="vitest" />
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
    rollupOptions: {
      external: [
        'd3-drag',
        'd3-force',
        'd3-selection',
        'd3-zoom',
        'ts-deepmerge',
        'vecti',
      ],
      output: {
        globals: {
          'd3-drag': 'd3',
          'd3-force': 'd3',
          'd3-selection': 'd3',
          'd3-zoom': 'd3',
          vecti: 'vecti',
        },
      },
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
