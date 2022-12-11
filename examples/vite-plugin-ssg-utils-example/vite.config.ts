import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import SSGUtils from 'vite-plugin-ssg-utils'

export default defineConfig({
  plugins: [Vue(), SSGUtils()],
})
