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
  build: {
    transpile: ['vue-toastification'],
  },
  unocss: {
    uno: true,
    icons: true,
    attributify: true,
    preflight: true,
    theme: {
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
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
