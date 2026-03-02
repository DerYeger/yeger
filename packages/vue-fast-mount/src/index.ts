import type { Plugin } from 'vite'

import { transformImportAttributes } from './transformImportAttributes'
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

      return transformImportAttributes(code)
    },
  }
}

function isNodeModulesPath(id: string): boolean {
  return id.includes('/node_modules/') || id.includes('\\node_modules\\')
}
