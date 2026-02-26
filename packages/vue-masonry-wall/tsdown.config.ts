import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: { tsconfig: './tsconfig.build.json', vue: true },
  plugins: [vue({ isProduction: true })],
})
