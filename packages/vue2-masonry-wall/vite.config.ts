import * as path from 'path'

import type { UserConfigExport } from 'vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { createVuePlugin } from 'vite-plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
    dts({
      cleanVueFileName: true,
      include: 'src/**',
      outputDir: 'dist/types',
      staticImport: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'umd'],
      name: 'MasonryWall',
      fileName: (format) => `masonry-wall.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    coverage: {
      all: true,
      include: ['src/**/*.*'],
    },
  },
} as UserConfigExport)
