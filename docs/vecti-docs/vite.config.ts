import { defineConfig } from 'vite'
import { tsconfigPaths } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  optimizeDeps: {
    include: ['vue'],
  },
})
