import { defineConfig } from 'vite'
import { cleanup, tsconfigPaths } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), cleanup()],
  optimizeDeps: {
    include: ['vue'],
  },
})
