// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Apollo',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  modules: ['@unocss/nuxt', 'nuxt-icon'],
  css: ['@/assets/css/main.css'],
  unocss: {
    uno: true,
    icons: true,
    attributify: true,
    preflight: true,
    webFonts: {
      fonts: {
        ui: {
          name: 'Readex Pro',
          weights: [200, 300, 400, 500, 600, 700],
        },
      },
    },
    shortcuts: [],
    rules: [],
  },
})
