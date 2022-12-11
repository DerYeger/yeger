/// <reference types="vitest" />
import * as path from 'path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import Meta from './package.json'

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
      name: Meta.name,
      fileName: (format) =>
        `${Meta.name}.${format}.${format === 'es' ? 'mjs' : 'js'}`,
    },
  },
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '~test',
        replacement: path.resolve(__dirname, 'test'),
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
