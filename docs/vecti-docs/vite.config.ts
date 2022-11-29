import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['vue'],
  },
})
