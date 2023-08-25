import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { coverage, library } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), library()],
  test: {
    environment: 'jsdom',
    coverage,
  },
})
