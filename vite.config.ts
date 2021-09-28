import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import typescript from 'rollup-plugin-typescript2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '../src',
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
})
