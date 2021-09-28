import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import dts from 'vite-plugin-dts'
import typescript from 'rollup-plugin-typescript2'
import ttypescript from 'ttypescript'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      logDiagnostics: true,
    }),
    vue(),
    typescript({
      typescript: ttypescript,
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
