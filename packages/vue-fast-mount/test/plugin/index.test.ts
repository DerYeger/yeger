import type { Plugin, PluginOption, TransformResult } from 'vite'
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
    const plugins = getPlugins(vueFastMount())

    expect(plugins).toHaveLength(2)
    expect(plugins[0]?.name).toBe('vue-fast-mount:test-files')
    expect(plugins[0]?.enforce).toBe('pre')
    expect(plugins[1]?.name).toBe('vue-fast-mount:compiled-vue')
    expect(plugins[1]?.enforce).toBeUndefined()
  })

  test('skips test files in node_modules', ({ expect }) => {
    const plugins = getPlugins(vueFastMount())

    const result = callTransformHook(
      plugins,
      'const value = 1',
      '/workspace/node_modules/pkg/index.test.ts',
    )

    expect(result).toBeNull()
    expect(mocks.transformCompiledComponent).not.toHaveBeenCalled()
    expect(mocks.transformImportAttributes).not.toHaveBeenCalled()
  })

  test('skips marked vue files in node_modules', ({ expect }) => {
    const plugins = getPlugins(vueFastMount())

    const result = callTransformHook(
      plugins,
      'const value = 1',
      `/workspace/node_modules/pkg/index.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}`,
    )

    expect(result).toBeNull()
    expect(mocks.transformCompiledComponent).not.toHaveBeenCalled()
    expect(mocks.transformImportAttributes).not.toHaveBeenCalled()
  })

  describe('compiled script transformation', () => {
    test('transforms marked compiled vue scripts', ({ expect }) => {
      const plugins = getPlugins(vueFastMount())

      const TEST_TRASNFORM_RESULT: TransformResult = { code: 'transformed-vue-code', map: null }
      mocks.transformCompiledComponent.mockReturnValueOnce(TEST_TRASNFORM_RESULT)

      const TEST_CODE = 'vue-input-code'
      const TEST_ID = `/workspace/src/Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&${FAST_MOUNT_UNSTUB_QUERY_KEY}=Child&vue&type=script&setup=true&lang.ts`
      const result = callTransformHook(plugins, TEST_CODE, TEST_ID)

      expect(transformCompiledComponent).toHaveBeenCalledWith(TEST_CODE, TEST_ID)
      expect(result).toStrictEqual(TEST_TRASNFORM_RESULT)
    })

    test('forwards marked vue query modules to compiled transform', ({ expect }) => {
      const plugins = getPlugins(vueFastMount())

      const TEST_CODE = 'vue-input-code'
      const TEST_ID = `/workspace/src/Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}`
      const result = callTransformHook(plugins, TEST_CODE, TEST_ID)

      expect(result).toBeNull()
      expect(mocks.transformCompiledComponent).toHaveBeenCalledWith(TEST_CODE, TEST_ID)
      expect(mocks.transformImportAttributes).not.toHaveBeenCalled()
    })
  })

  describe('test file transformation', () => {
    test('rewrites vfm import attributes', ({ expect }) => {
      const plugins = getPlugins(vueFastMount())

      const TEST_CODE = "import Parent from './Parent.vue' with { vfm: 'true' }"
      const TEST_RESULT: TransformResult = {
        code: "import Parent from './Parent.vue?__vfm=1'",
        map: null,
      }
      mocks.transformImportAttributes.mockReturnValueOnce(TEST_RESULT)

      const TEST_ID = '/workspace/test/Parent.test.ts'
      const result = callTransformHook(plugins, TEST_CODE, TEST_ID)

      expect(mocks.transformImportAttributes).toHaveBeenCalledWith(TEST_CODE, TEST_ID)
      expect(result).toStrictEqual(TEST_RESULT)
      expect(mocks.transformCompiledComponent).not.toHaveBeenCalled()
    })
  })
})

function callTransformHook(plugins: Plugin[], code: string, id: string): TransformResult | null {
  for (const plugin of plugins) {
    if (!matchesIdFilter(plugin, id) || !plugin.transform) {
      continue
    }

    if (typeof plugin.transform === 'function') {
      throw new Error('Plugin transform hook is not a hook object')
    }

    // @ts-expect-error - We are intentionally calling the transform hook directly for testing purposes
    return plugin.transform.handler(code, id)
  }

  return null
}

function getPlugins(pluginOption: PluginOption): Plugin[] {
  if (!pluginOption) {
    return []
  }

  if (Array.isArray(pluginOption)) {
    return pluginOption.flatMap((entry) => getPlugins(entry))
  }

  if (typeof pluginOption === 'object' && pluginOption !== null && 'then' in pluginOption) {
    throw new Error('Expected vueFastMount() to return synchronous plugins')
  }

  if (!isPlugin(pluginOption)) {
    throw new Error('Expected vueFastMount() to return Vite plugins')
  }

  return [pluginOption]
}

function matchesIdFilter(plugin: Plugin, id: string): boolean {
  if (!plugin.transform || typeof plugin.transform === 'function') {
    return false
  }

  const filter = plugin.transform.filter?.id
  if (!filter) {
    return true
  }

  if (Array.isArray(filter)) {
    return filter.some((entry) => matchesPattern(entry, id))
  }

  if (typeof filter === 'string' || filter instanceof RegExp) {
    return matchesPattern(filter, id)
  }

  if (filter) {
    if (!matchesPatternList(filter.include, id, true)) {
      return false
    }

    return !matchesPatternList(filter.exclude, id, false)
  }

  return true
}

function matchesPattern(pattern: string | RegExp, id: string): boolean {
  return typeof pattern === 'string' ? pattern === id : pattern.test(id)
}

function matchesPatternList(
  pattern: string | RegExp | (string | RegExp)[] | undefined,
  id: string,
  defaultValue: boolean,
): boolean {
  if (!pattern) {
    return defaultValue
  }

  if (Array.isArray(pattern)) {
    return pattern.some((entry) => matchesPattern(entry, id))
  }

  return matchesPattern(pattern, id)
}

function isPlugin(value: PluginOption): value is Plugin {
  return typeof value === 'object' && value !== null && 'name' in value
}
