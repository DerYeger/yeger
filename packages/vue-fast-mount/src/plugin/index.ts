import { normalizePath, type Plugin } from 'vite'

import { getKeepBindingsFromId } from './getKeepBindingsFromId'
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
        const transformedCode = transformSFC(code, getKeepBindingsFromId(id))
        return transformedCode === code ? null : transformedCode
      }

      const transformedCode = rewriteFastMountCallsites(code)
      return transformedCode === code ? null : transformedCode
    },
  }
}
