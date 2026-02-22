import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  entry: ['./src/sync.ts', './src/async.ts'],
})
