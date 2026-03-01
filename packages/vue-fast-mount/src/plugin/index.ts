import type { Plugin } from 'vite'

import { transformFastMountCalls } from './transformFastMountCalls'
import { transformSFC } from './transformSFC'

export function vueFastMount(): Plugin {
  return {
    name: 'vue-fast-mount',
    enforce: 'pre',
    transform(code, id) {
      if (isNodeModulesPath(id)) {
        return null
      }

      if (id.includes('.vue')) {
        return transformSFC(code, id)
      }

      if (!code.includes('vue-fast-mount') || !code.includes('.vue') || !code.includes('import(')) {
        return null
      }
      return transformFastMountCalls(code)
    },
  }
}

function isNodeModulesPath(id: string): boolean {
  return id.includes('/node_modules/') || id.includes('\\node_modules\\')
}
