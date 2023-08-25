import { defineConfig } from 'vite'
import { library } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [library()],
})
