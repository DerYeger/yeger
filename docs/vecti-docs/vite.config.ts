import { defineConfig } from 'vite'
import { aliasPlugin } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [aliasPlugin()],
  optimizeDeps: {
    include: ['vue'],
  },
})
