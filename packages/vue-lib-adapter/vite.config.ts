import { defineConfig } from 'vite'
import { library } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    library({
      entry: 'src/index.ts',
      formats: ['es', 'umd'],
      name: 'vue-lib-adapter',
    }),
  ],
})
