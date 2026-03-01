import type { Plugin, TransformResult } from 'vite'
import { describe, test, vi } from 'vitest'

import { vueFastMount } from '../../src/plugin'
import {
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
} from '../../src/plugin/utils'

const mocks = vi.hoisted(() => ({
  transformFastMountCalls: vi.fn((_code: string): TransformResult | null => null),
  transformSFC: vi.fn((_code: string): TransformResult | null => null),
}))

vi.mock('../../src/plugin/transformFastMountCalls', () => ({
  transformFastMountCalls: mocks.transformFastMountCalls,
}))

vi.mock('../../src/plugin/transformSFC', () => ({
  transformSFC: mocks.transformSFC,
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
    expect(mocks.transformFastMountCalls).not.toHaveBeenCalled()
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

  describe('fastMount callsite transformation', () => {
    test('returns transformation', ({ expect }) => {
      const plugin = vueFastMount()

      const TEST_INPUT =
        'import { fastMount } from "vue-fast-mount";\nconst component = fastMount(() => import("./Component.vue"))'

      const TEST_RESULT: TransformResult = { code: 'rewritten-code', map: null }
      mocks.transformFastMountCalls.mockReturnValueOnce(TEST_RESULT)

      const result = callTransformHook(plugin, TEST_INPUT, '/workspace/src/spec.ts')

      expect(mocks.transformFastMountCalls).toHaveBeenCalledWith(TEST_INPUT)
      expect(result).toBe(TEST_RESULT)
    })

    test('returns null for unchanged code', ({ expect }) => {
      const plugin = vueFastMount()

      const TEST_CODE =
        'import { fastMount } from "vue-fast-mount";\nconst component = fastMount(() => import("./Component.vue"))'
      const result = callTransformHook(plugin, TEST_CODE, '/workspace/test/Child.test.ts')

      expect(mocks.transformFastMountCalls).toHaveBeenCalledWith(TEST_CODE)
      expect(result).toBeNull()
    })

    test('short-circuits when no vue-fast-mount is present', ({ expect }) => {
      const plugin = vueFastMount()

      const TEST_CODE = 'import { fastMount } from "something-else";'
      const result = callTransformHook(plugin, TEST_CODE, '/workspace/test/Child.test.ts')

      expect(mocks.transformFastMountCalls).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })
})

function callTransformHook(plugin: Plugin, code: string, id: string): TransformResult | null {
  if (!plugin.transform) {
    throw new Error('Plugin does not implement transform hook')
  }
  if (typeof plugin.transform !== 'function') {
    throw new Error('Plugin transform hook is not a function')
  }
  // @ts-expect-error - We are intentionally calling the transform hook directly for testing purposes
  return plugin.transform(code, id)
}
