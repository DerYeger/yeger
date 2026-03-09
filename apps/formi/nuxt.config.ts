import tailwindcss from '@tailwindcss/vite'

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
    '@nuxtjs/robots',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/fonts',
  ],

  css: ['@/assets/css/main.css'],

  build: {
    transpile: ['vue-toastification'],
  },

  fonts: {
    provider: 'npm',
    families: [{ name: 'Readex Pro', provider: 'npm', weights: [200, 300, 400, 500, 600, 700] }],
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: appName,
      short_name: appName,
      description: 'Formi is a web-application for model checking first-order-logic formulas.',
      background_color: '#f5f5f4',
      theme_color: '#f5f5f4',
      icons: [
        {
          src: '512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
  },

  compatibilityDate: '2026-03-09',
  vite: {
    // @ts-expect-error - Vite type mismatch
    plugins: [tailwindcss()],
  },
})
