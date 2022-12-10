import * as path from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
      fileName: (format) =>
        `masonry-wall.${format}.${format === 'es' ? 'mjs' : 'js'}`,
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
})
