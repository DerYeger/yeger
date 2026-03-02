import type { Plugin, TransformResult } from 'vite'
import { describe, test, vi } from 'vitest'

import { vueFastMount } from '../../src/index'
import {
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
} from '../../src/utils'

const mocks = vi.hoisted(() => ({
  transformSFC: vi.fn((_code: string): TransformResult | null => null),
  transformImportAttributes: vi.fn((_code: string): TransformResult | null => null),
}))

vi.mock('../../src/transformSFC', () => ({
  transformSFC: mocks.transformSFC,
}))

vi.mock('../../src/transformImportAttributes', () => ({
  transformImportAttributes: mocks.transformImportAttributes,
}))

describe('plugin', () => {
  test('exposes plugin metadata', ({ expect }) => {
    const plugin = vueFastMount()

    expect(plugin.name).toBe('vue-fast-mount')
    expect(plugin.enforce).toBe('pre')
  })

  test('skips files in node_modules', ({ expect }) => {
    const plugin = vueFastMount()

    const result = callTransformHook(
      plugin,
      'const value = 1',
      '/workspace/node_modules/pkg/index.vue',
    )

    expect(result).toBeNull()
    expect(mocks.transformSFC).not.toHaveBeenCalled()
    expect(mocks.transformImportAttributes).not.toHaveBeenCalled()
  })

  describe('SFC transformation', () => {
    test('transforms marked SFCs', ({ expect }) => {
      const plugin = vueFastMount()

      const TEST_TRASNFORM_RESULT: TransformResult = { code: 'transformed-vue-code', map: null }
      mocks.transformSFC.mockReturnValueOnce(TEST_TRASNFORM_RESULT)

      const TEST_CODE = 'vue-input-code'
      const TEST_ID = `/workspace/src/Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&${FAST_MOUNT_UNSTUB_QUERY_KEY}=Child`
      const result = callTransformHook(plugin, TEST_CODE, TEST_ID)

      expect(mocks.transformSFC).toHaveBeenCalledWith(TEST_CODE, TEST_ID)
      expect(result).toStrictEqual(TEST_TRASNFORM_RESULT)
    })
  })

  describe('test file transformation', () => {
    test('rewrites vfm import attributes', ({ expect }) => {
      const plugin = vueFastMount()

      const TEST_CODE = "import Parent from './Parent.vue' with { vfm: 'true' }"
      const TEST_RESULT: TransformResult = {
        code: "import Parent from './Parent.vue?__vfm=1'",
        map: null,
      }
      mocks.transformImportAttributes.mockReturnValueOnce(TEST_RESULT)

      const result = callTransformHook(plugin, TEST_CODE, '/workspace/test/Parent.test.ts')

      expect(mocks.transformImportAttributes).toHaveBeenCalledWith(TEST_CODE)
      expect(result).toStrictEqual(TEST_RESULT)
    })
  })
})

function callTransformHook(plugin: Plugin, code: string, id: string): TransformResult | null {
  if (!plugin.transform) {
    throw new Error('Plugin does not implement transform hook')
  }
  if (typeof plugin.transform === 'function') {
    throw new Error('Plugin transform hook is not a hook object')
  }
  // @ts-expect-error - We are intentionally calling the transform hook directly for testing purposes
  return plugin.transform.handler(code, id)
}
