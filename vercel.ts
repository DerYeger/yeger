import type { VercelConfig } from '@vercel/config/v1'

export const config: VercelConfig = {
  git: {
    deploymentEnabled: {
      'changeset-release/main': false,
      'renovate/*': false,
    },
  },
}
