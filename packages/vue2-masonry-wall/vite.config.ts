import process from 'node:process'

import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'
import { library } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    library({
      entry: 'src/index.ts',
      formats: ['es', 'umd'],
      name: 'MasonryWall',
      externalPackages: ['@yeger/vue-masonry-wall-core'],
    }),
  ],
  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
          '@yeger/vue-masonry-wall-core': 'MasonryWallCore',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
