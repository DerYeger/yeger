import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: {
    tsconfig: './tsconfig.build.json',
  },
  entry: ['./src/sync.ts', './src/async.ts'],
})
