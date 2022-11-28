import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: '../src',
      },
    ],
  },
})
