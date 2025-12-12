import { defineConfig } from 'vite'
import { cleanup } from 'vite-plugin-lib'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    cleanup(),
  ],
  optimizeDeps: {
    include: ['vue'],
  },
  ssr: {
    noExternal: ['d3-drag', 'd3-force', 'd3-selection', 'd3-zoom'],
  },
})
