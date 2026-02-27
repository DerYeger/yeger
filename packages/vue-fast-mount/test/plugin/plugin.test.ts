import { describe, test, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  getKeepBindingsFromId: vi.fn(() => new Set<string>()),
  rewriteFastMountCallsites: vi.fn((code: string) => code),
  shouldTransformSFC: vi.fn(() => false),
  transformSFC: vi.fn((code: string) => code),
}))

vi.mock('../../src/plugin/getKeepBindingsFromId', () => ({
  getKeepBindingsFromId: mocks.getKeepBindingsFromId,
}))

vi.mock('../../src/plugin/rewriteFastMountCallsites', () => ({
  rewriteFastMountCallsites: mocks.rewriteFastMountCallsites,
}))

vi.mock('../../src/plugin/shouldTransformSFC', () => ({
  shouldTransformSFC: mocks.shouldTransformSFC,
}))

vi.mock('../../src/plugin/transformSFC', () => ({
  transformSFC: mocks.transformSFC,
}))

import { vueFastMount } from '../../src/plugin'

describe('plugin', () => {
  test('exposes plugin metadata', ({ expect }) => {
    const plugin = vueFastMount()

    expect(plugin.name).toBe('vue-fast-mount')
    expect(plugin.enforce).toBe('pre')
  })

  test('skips files in node_modules', ({ expect }) => {
    const plugin = vueFastMount()

    const result = (plugin.transform as any)?.('const value = 1', '/src/node_modules/pkg/index.ts')

    expect(result).toBeNull()
    expect(mocks.shouldTransformSFC).not.toHaveBeenCalled()
    expect(mocks.rewriteFastMountCallsites).not.toHaveBeenCalled()
  })

  test('delegates to callsite rewrite for non-vue fast-mount ids', ({ expect }) => {
    const plugin = vueFastMount()

    mocks.rewriteFastMountCallsites.mockReturnValueOnce('rewritten-code')

    const result = (plugin.transform as any)?.('input-code', '/src/spec.ts')

    expect(mocks.shouldTransformSFC).toHaveBeenCalledWith('/src/spec.ts')
    expect(mocks.rewriteFastMountCallsites).toHaveBeenCalledWith('input-code')
    expect(result).toBe('rewritten-code')
  })

  test('delegates to vue source transform for fast-mount ids', ({ expect }) => {
    const plugin = vueFastMount()

    mocks.shouldTransformSFC.mockReturnValueOnce(true)
    mocks.getKeepBindingsFromId.mockReturnValueOnce(new Set(['Child']))
    mocks.transformSFC.mockReturnValueOnce('transformed-vue-code')

    const result = (plugin.transform as any)?.(
      'vue-input-code',
      '/src/Parent.vue?__vfm=1&__vfm_keep=Child',
    )

    expect(mocks.shouldTransformSFC).toHaveBeenCalledWith(
      '/src/Parent.vue?__vfm=1&__vfm_keep=Child',
    )
    expect(mocks.getKeepBindingsFromId).toHaveBeenCalledWith(
      '/src/Parent.vue?__vfm=1&__vfm_keep=Child',
    )
    expect(mocks.transformSFC).toHaveBeenCalledWith('vue-input-code', new Set(['Child']))
    expect(result).toBe('transformed-vue-code')
  })

  test('returns null when helper returns unchanged source', ({ expect }) => {
    const plugin = vueFastMount()

    mocks.rewriteFastMountCallsites.mockReturnValueOnce('same-code')

    const result = (plugin.transform as any)?.('same-code', '/src/spec.ts')

    expect(result).toBeNull()
  })
})
