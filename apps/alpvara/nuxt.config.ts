export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@pinia/colada-nuxt',
    '@pinia/nuxt',
    'nuxt-charts',
  ],

  compatibilityDate: '2025-01-15',

  css: ['~/assets/css/main.css'],

  i18n: {
    defaultLocale: 'de',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
    },
    locales: [
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
  },

  icon: {
    clientBundle: {
      scan: true,
    },
    serverBundle: false,
  },

  runtimeConfig: {
    clientId: '',
    redirectUri: 'http://localhost:3000/callback',
  },

  ssr: false,

  ui: {
    colorMode: false,
  },
})
