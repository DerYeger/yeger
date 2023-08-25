import { defineConfig } from 'vite'
import { coverage, library } from 'vite-plugin-lib'

export default defineConfig({
  plugins: [library()],
  test: {
    environment: 'jsdom',
    coverage,
  },
})
