// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Formi',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          type: 'image/webp',
          rel: 'icon',
          href: '/hero-first-small.webp',
        },
        {
          type: 'image/png',
          rel: 'icon',
          href: '/hero-first-small.png',
        },
      ],
      meta: [
        {
          name: 'description',
          content:
            'A web-application for model checking first-order-logic formulas.',
        },
      ],
    },
  },
  modules: [
    '@kevinmarrec/nuxt-pwa',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
  ],
  css: ['@/assets/css/main.css'],
  build: {
    transpile: ['vue-toastification'],
  },
  pwa: {
    manifest: {
      background_color: '#f5f5f4',
      theme_color: '#f5f5f4',
    },
    meta: {
      favicon: false,
    },
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
