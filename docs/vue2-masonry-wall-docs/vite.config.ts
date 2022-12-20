import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'vite'
import { aliasPlugin } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), aliasPlugin()],
})
