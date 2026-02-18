import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'tsdown'

export default defineConfig({
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
})
