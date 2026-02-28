import { normalizePath, type Plugin } from 'vite'

import { getUnstubbedComponentFromId } from './getUnstubbedComponentFromId'
import { rewriteFastMountCallsites } from './rewriteFastMountCallsites'
import { shouldTransformSFC } from './shouldTransformSFC'
import { transformSFC } from './transformSFC'

export function vueFastMount(): Plugin {
  return {
    name: 'vue-fast-mount',
    enforce: 'pre',
    transform(code, id) {
      if (normalizePath(id).includes('/node_modules/')) {
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
