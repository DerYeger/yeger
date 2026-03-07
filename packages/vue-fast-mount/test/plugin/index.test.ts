import type { Plugin, TransformResult } from 'vite'
import { describe, test, vi } from 'vitest'

import { vueFastMount } from '../../src/index'
import { transformCompiledComponent } from '../../src/transformCompiledComponent'
import {
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
} from '../../src/utils'

const mocks = vi.hoisted(() => ({
  transformCompiledComponent: vi.fn((_code: string): TransformResult | null => null),
  transformImportAttributes: vi.fn((_code: string): TransformResult | null => null),
}))

vi.mock('../../src/transformCompiledComponent', () => ({
  transformCompiledComponent: mocks.transformCompiledComponent,
}))

vi.mock('../../src/transformImportAttributes', () => ({
  transformImportAttributes: mocks.transformImportAttributes,
}))

describe('plugin', () => {
  test('exposes plugin metadata', ({ expect }) => {
    const plugin = vueFastMount()

    expect(plugin.name).toBe('vue-fast-mount')
    expect(plugin.enforce).toBeUndefined()
  })

  test('skips files in node_modules', ({ expect }) => {
    const plugin = vueFastMount()

    const result = callTransformHook(
      plugin,
      'const value = 1',
      '/workspace/node_modules/pkg/index.vue',
    )

    expect(result).toBeNull()
    expect(mocks.transformCompiledComponent).not.toHaveBeenCalled()
    expect(mocks.transformImportAttributes).not.toHaveBeenCalled()
  })

  describe('compiled script transformation', () => {
    test('transforms marked compiled vue scripts', ({ expect }) => {
      const plugin = vueFastMount()

      const TEST_TRASNFORM_RESULT: TransformResult = { code: 'transformed-vue-code', map: null }
      mocks.transformCompiledComponent.mockReturnValueOnce(TEST_TRASNFORM_RESULT)

      const TEST_CODE = 'vue-input-code'
      const TEST_ID = `/workspace/src/Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&${FAST_MOUNT_UNSTUB_QUERY_KEY}=Child&vue&type=script&setup=true&lang.ts`
      const result = callTransformHook(plugin, TEST_CODE, TEST_ID)

      expect(transformCompiledComponent).toHaveBeenCalledWith(TEST_CODE, TEST_ID)
      expect(result).toStrictEqual(TEST_TRASNFORM_RESULT)
    })

    test('forwards marked vue query modules to compiled transform', ({ expect }) => {
      const plugin = vueFastMount()

      const TEST_CODE = 'vue-input-code'
      const TEST_ID = `/workspace/src/Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}`
      const result = callTransformHook(plugin, TEST_CODE, TEST_ID)

      expect(result).toBeNull()
      expect(mocks.transformCompiledComponent).toHaveBeenCalledWith(TEST_CODE, TEST_ID)
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

      const TEST_ID = '/workspace/test/Parent.test.ts'
      const result = callTransformHook(plugin, TEST_CODE, TEST_ID)

      expect(mocks.transformImportAttributes).toHaveBeenCalledWith(TEST_CODE, TEST_ID)
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
