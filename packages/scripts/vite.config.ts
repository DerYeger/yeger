import { coverage, library } from 'vite-plugin-lib'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [library()],
  test: {
    coverage,
  },
})
