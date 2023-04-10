import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { library } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    library({
      entry: 'src/index.ts',
      formats: ['es', 'umd'],
      name: 'MarmosetViewer',
    }),
  ],
  build: {
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
    environment: 'jsdom',
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
