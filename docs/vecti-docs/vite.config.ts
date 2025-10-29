import { defineConfig } from 'vite'
import { cleanup } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [cleanup()],
  optimizeDeps: {
    include: ['vue'],
  },
})
