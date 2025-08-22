import { defineConfig } from 'vitepress'

import Package from '../../../packages/key-hierarchy/package.json'

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
  ],

  // theme and its config
  themeConfig: {
    editLink: {
      pattern:
        'https://github.com/DerYeger/yeger/tree/main/docs/key-hierarchy-docs/:path',
      text: 'Suggest changes to this page',
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],

    search: {
      provider: 'local',
    },

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'TanStack Query Integration', link: '/guide/tanstack-query' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'defineKeyHierarchy', link: '/api/define-key-hierarchy' },
            { text: 'defineKeyHierarchyModule', link: '/api/define-key-hierarchy-module' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'twitter', link: 'https://twitter.com/DerYeger' },
      {
        icon: 'github',
        link: 'https://github.com/DerYeger/yeger/tree/main/packages/key-hierarchy',
      },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/key-hierarchy',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Jan Müller',
    },
  },
})
