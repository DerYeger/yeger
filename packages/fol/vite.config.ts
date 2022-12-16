import path from 'node:path'

import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

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
      entry: path.resolve(__dirname, 'src/fol.ts'),
      formats: ['es', 'umd'],
      name: 'fol',
      fileName: (format: string) =>
        `fol.${format}.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['ohm-js'],
      output: {
        globals: {
          'ohm-js': 'ohm',
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
      {
        find: '~test',
        replacement: path.resolve(__dirname, 'test'),
      },
    ],
  },
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
