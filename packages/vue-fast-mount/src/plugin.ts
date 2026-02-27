import { normalizePath, type Plugin } from 'vite'

import {
  getKeepBindingsFromId,
  rewriteFastMountCallsites,
  shouldTransformVueFastMountId,
  transformFastMountVueSource,
} from './plugin-helpers'

export function vueFastMount(): Plugin {
  return {
    name: 'vue-fast-mount',
    enforce: 'pre',
    transform(code, id) {
      if (normalizePath(id).includes('/node_modules/')) {
        return null
      }

      if (shouldTransformVueFastMountId(id)) {
        const transformedCode = transformFastMountVueSource(code, getKeepBindingsFromId(id))
        return transformedCode === code ? null : transformedCode
      }

      const transformedCode = rewriteFastMountCallsites(code)
      return transformedCode === code ? null : transformedCode
    },
  }
}
