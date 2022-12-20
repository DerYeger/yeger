import { defineConfig } from 'vite'
import { libPlugin } from 'vite-plugin-lib'

export default defineConfig({
  plugins: [
    libPlugin({
      entry: 'src/main.ts',
      formats: ['es', 'umd'],
      name: 'd3-graph-controller',
    }),
  ],
  build: {
    rollupOptions: {
      external: ['d3-drag', 'd3-force', 'd3-selection', 'd3-zoom', 'vecti'],
      output: {
        globals: {
          'd3-drag': 'd3',
          'd3-force': 'd3',
          'd3-selection': 'd3',
          'd3-zoom': 'd3',
          vecti: 'vecti',
        },
      },
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
