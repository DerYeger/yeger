import { defineConfig } from 'vite'
import { coverage, library } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [library()],
  test: {
    coverage,
  },
})
