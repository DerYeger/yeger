import tailwindcss from '@tailwindcss/vite'

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
        {
          type: 'image/png',
          rel: 'apple-touch-icon',
          href: '/512x512.png',
        },
      ],
    },
  },

  modules: ['@nuxtjs/robots', '@vueuse/nuxt', '@nuxt/icon', '@nuxt/test-utils', '@nuxt/fonts'],

  css: ['@/assets/css/main.css'],

  build: {
    transpile: ['vue-toastification'],
  },

  fonts: {
    provider: 'npm',
    families: [{ name: 'Readex Pro', provider: 'npm', weights: [200, 300, 400, 500, 600, 700] }],
  },

  compatibilityDate: '2025-01-15',
  vite: {
    plugins: [tailwindcss()],
  },
})
