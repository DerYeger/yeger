import type { RcFile } from 'syncpack'

const config: RcFile = {
  versionGroups: [
    {
      label: 'Ignored',
      dependencyTypes: ['peer'],
      isIgnored: true,
    },
    {
      label: 'Ignored Nuxt .output',
      packages: ['*-prod'],
      isIgnored: true,
    },
    {
      label: 'Local',
      dependencies: [
        '@yeger/*',
        'd3-graph-controller',
        'key-hierarchy',
        'resumon',
        'vecti',
        'vue-fast-mount',
        'vue-marmoset-viewer',
      ],
      pinVersion: 'workspace:*',
    },
    {
      label: 'Turbo',
      dependencies: ['turbo'],
    },
    {
      label: 'External (Vite 7)',
      packages: ['alpvara', 'formi'],
      dependencies: ['vite'],
      pinVersion: 'catalog:vite7',
    },
    {
      label: 'External',
      pinVersion: 'catalog:',
    },
  ],
}

export default config
