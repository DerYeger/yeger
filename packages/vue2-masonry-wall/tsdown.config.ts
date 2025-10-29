import { defineConfig } from 'tsdown'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
})
