import { library } from 'vite-plugin-lib'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    library({ entry: 'src/fol.ts', name: 'fol', formats: ['es', 'umd'] }),
  ],
  build: {
    rollupOptions: {
      external: ['ohm-js'],
      output: {
        globals: {
          'ohm-js': 'ohm',
        },
      },
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
