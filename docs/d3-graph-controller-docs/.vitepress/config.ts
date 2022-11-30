import { defineConfig } from 'vitepress'

import Package from '../../../packages/d3-graph-controller/package.json'

const ogImage = `${Package.homepage}/logo.png`

export default defineConfig({
  // site config
  lang: 'en-US',
  title: Package.name,
  description: Package.description,
  outDir: 'dist',
  head: [
    ['meta', { property: 'og:title', content: Package.name }],
    [
      'meta',
      {
        property: 'og:description',
        content: Package.description,
      },
    ],
    ['meta', { property: 'og:url', content: Package.homepage }],
    [
      'meta',
      {
        property: 'og:image',
        content: ogImage,
      },
    ],
    ['meta', { name: 'twitter:title', content: Package.name }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: Package.description,
      },
    ],
    [
      'meta',
      {
        name: 'twitter:image',
        content: ogImage,
      },
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
  ],

  // theme and its config
  themeConfig: {
    editLink: {
      pattern:
        'https://github.com/DerYeger/yeger/tree/main/docs/d3-graph-controller-docs/:path',
      text: 'Suggest changes to this page',
    },

    logo: '/logo.svg',

    algolia: {
      appId: 'P6B0O55SU2',
      apiKey: '8191ba63a5c47585bbc996cd8db4f201',
      indexName: 'd3-graph-controller',
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Config', link: '/config/' },
      { text: 'Demo', link: '/demo/' },
    ],

    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/DerYeger' },
      {
        icon: 'github',
        link: 'https://github.com/DerYeger/yeger/tree/main/packages/d3-graph-controller',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT Jan Müller',
    },
  },
})
