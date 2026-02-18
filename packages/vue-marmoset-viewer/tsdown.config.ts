import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'tsdown'

export default defineConfig({
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
})
