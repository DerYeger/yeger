// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // alias: {
  //   'ts-deepmerge': 'ts-deepmerge/dist/index.js',
  // },
  modules: ['@unocss/nuxt'],
  css: ['@/assets/css/main.css'],
  unocss: {
    uno: true,
    icons: true,
    attributify: true,
    shortcuts: [],
    rules: [],
  },
  vite: {
    optimizeDeps: {
      include: ['d3-graph-controller > ts-deepmerge'],
    },
  },
})
