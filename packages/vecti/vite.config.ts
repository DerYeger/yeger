import { defineConfig } from 'vite'
import { library } from 'vite-plugin-lib'

export default defineConfig({
  plugins: [
    library({
      entry: 'src/vecti.ts',
      formats: ['es', 'umd'],
      name: 'vecti',
    }),
  ],
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      enabled: !!process.env.COVERAGE,
      all: true,
      include: ['src/**/*.*'],
    },
  },
})
