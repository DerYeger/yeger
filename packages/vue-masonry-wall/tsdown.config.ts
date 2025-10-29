import { defineConfig } from 'tsdown'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
})
