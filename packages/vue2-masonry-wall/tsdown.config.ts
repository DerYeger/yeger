import vue from '@vitejs/plugin-vue2'
import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: { vue: true },
  plugins: [vue({ isProduction: true })],
})
