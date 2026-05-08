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
      dependencies: ['$LOCAL'],
      pinVersion: 'workspace:*',
    },
    {
      label: 'Overrides',
      dependencyTypes: ['pnpmOverrides'],
      isIgnored: true,
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
      policy: 'catalog',
    },
  ],
}

export default config
