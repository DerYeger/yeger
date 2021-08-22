import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'demo',
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '../src',
      },
    ],
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
})
