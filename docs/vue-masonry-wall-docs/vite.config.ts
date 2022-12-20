import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { aliasPlugin } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), aliasPlugin()],
})
