import { defineConfig } from 'vitepress'

import Meta from '../../../packages/vecti/package.json'

const name = Meta.name.charAt(0).toUpperCase() + Meta.name.slice(1)

export default defineConfig({
  // site config
  lang: 'en-US',
  title: name,
  description: Meta.description,
  outDir: 'dist',
  head: [
    ['meta', { property: 'og:title', content: name }],
    [
      'meta',
      {
        property: 'og:description',
        content: Meta.description,
      },
    ],
    ['meta', { property: 'og:url', content: Meta.homepage }],
    [
      'meta',
      {
        property: 'og:image',
        content: `${Meta.homepage}/logo.png`,
      },
    ],
    ['meta', { name: 'twitter:title', content: name }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: Meta.description,
      },
    ],
    [
      'meta',
      {
        name: 'twitter:image',
        content: `${Meta.homepage}/logo.png`,
      },
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
  ],

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },

  // theme and its config
  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      pattern: 'https://github.com/DerYeger/vecti/tree/master/docs/:path',
      text: 'Suggest changes to this page',
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],

    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/DerYeger' },
      {
        icon: 'github',
        link: 'https://github.com/DerYeger/vecti',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT Jan Müller',
    },
  },
})
