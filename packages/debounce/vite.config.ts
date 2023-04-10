import { defineConfig } from 'vite'
import { library } from 'vite-plugin-lib'

export default defineConfig({
  plugins: [
    library({
      entry: 'src/main.ts',
      formats: ['es', 'umd'],
      name: 'debounce',
    }),
  ],
  test: {
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
