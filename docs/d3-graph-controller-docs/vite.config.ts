import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: ['d3-drag', 'd3-force', 'd3-selection', 'd3-zoom'],
  },
})
