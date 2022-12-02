import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Components({
      include: [/\.vue/, /\.md/],
      dirs: '.vitepress/components',
      dts: '.vitepress/components.d.ts',
    }),
    tsconfigPaths({ loose: true }),
  ],
  optimizeDeps: {
    include: ['vue'],
  },
  ssr: {
    noExternal: ['d3-drag', 'd3-force', 'd3-selection', 'd3-zoom'],
  },
})
