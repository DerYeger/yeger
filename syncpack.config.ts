import type { RcFile } from 'syncpack'

const config: RcFile = {
  strict: true,
  versionGroups: [
    {
      label: 'Ignored',
      dependencyTypes: ['local', 'peer'],
      isIgnored: true,
    },
    {
      label: 'Turborepo',
      packages: ['yeger-monorepo'],
      dependencies: ['turbo'],
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
