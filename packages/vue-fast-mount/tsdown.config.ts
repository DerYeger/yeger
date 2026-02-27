import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: {
    tsconfig: './tsconfig.build.json',
  },
  entry: ['./src/index.ts', './src/plugin/index.ts'],
})
