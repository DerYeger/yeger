import type { Plugin, TransformResult } from 'vite'

import { transformImportAttributes } from './transformImportAttributes'
import { transformSFC } from './transformSFC'

const VUE_ID_REGEX = /\.vue(\?.*)?$/
export const TEST_FILE_ID_REGEX: RegExp = /\.(test|spec)\.[jt]sx?$/

export interface VueFastMountOptions {
  /**
   * RegEx for matching test files. Defaults to {@link TEST_FILE_ID_REGEX}.
   * Only Vue SFC imports within matching files will be transformed for performance reasons.
   */
  testFileRegex: RegExp
  /**
   * Enables debug logging. Logs transformed files and components to the console. Defaults to `false`.
   */
  debug: boolean
}

export function vueFastMount(options?: Partial<VueFastMountOptions>): Plugin {
  const resolvedOptions: VueFastMountOptions = {
    testFileRegex: TEST_FILE_ID_REGEX,
    debug: false,
    ...options,
  }

  function withDebugLogging(id: string, result: TransformResult | null): TransformResult | null {
    if (resolvedOptions.debug && result) {
      // oxlint-disable-next-line no-console
      console.log(
        `\n--BEGIN ${id} --\n${result.code}\n${JSON.stringify(result.map, null, 2)}\n--END ${id} --\n`,
      )
    }
    return result
  }

  return {
    name: 'vue-fast-mount',
    enforce: 'pre',
    apply: (config) => config.mode === 'test',
    transform: {
      filter: { id: [VUE_ID_REGEX, resolvedOptions.testFileRegex] },
      handler(code, id) {
        if (isNodeModulesPath(id)) {
          return null
        }

        if (id.includes('.vue?')) {
          return withDebugLogging(id, transformSFC(code, id))
        }

        return withDebugLogging(id, transformImportAttributes(code, id))
      },
    },
  }
}

function isNodeModulesPath(id: string): boolean {
  return id.includes('/node_modules/') || id.includes('\\node_modules\\')
}
