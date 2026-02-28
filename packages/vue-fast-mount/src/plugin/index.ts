import type { Plugin } from 'vite'

import { getUnstubbedComponentFromId } from './getUnstubbedComponentFromId'
import { rewriteFastMountCallsites } from './rewriteFastMountCallsites'
import { shouldTransformSFC } from './shouldTransformSFC'
import { transformSFC } from './transformSFC'

export function vueFastMount(): Plugin {
  return {
    name: 'vue-fast-mount',
    enforce: 'pre',
    transform(code, id) {
      if (isNodeModulesPath(id)) {
        return null
      }

      if (shouldTransformSFC(id)) {
        const transformedCode = transformSFC(code, getUnstubbedComponentFromId(id))
        if (transformedCode === code) {
          return null
        }
        return transformedCode
      }

      const transformedCode = rewriteFastMountCallsites(code)
      if (transformedCode === code) {
        return null
      }
      return transformedCode
    },
  }
}

function isNodeModulesPath(id: string): boolean {
  return id.includes('/node_modules/') || id.includes('\\node_modules\\')
}
