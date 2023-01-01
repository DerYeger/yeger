const appName = 'Formi'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: appName,
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
        {
          type: 'image/png',
          rel: 'apple-touch-icon',
          href: '/512x512.png',
        },
      ],
    },
  },
  modules: [
    '@kevinmarrec/nuxt-pwa',
    '@nuxtjs/robots',
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
      name: appName,
      short_name: appName,
      background_color: '#f5f5f4',
      theme_color: '#f5f5f4',
    },
    meta: {
      favicon: false,
      description:
        'Formi is a web-application for model checking first-order-logic formulas.',
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
