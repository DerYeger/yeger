import { beforeEach, describe, test, vi } from 'vitest'

const {
  mockGetKeepBindingsFromId,
  mockRewriteFastMountCallsites,
  mockShouldTransformVueFastMountId,
  mockTransformFastMountVueSource,
} = vi.hoisted(() => ({
  mockGetKeepBindingsFromId: vi.fn(() => new Set<string>()),
  mockRewriteFastMountCallsites: vi.fn((code: string) => code),
  mockShouldTransformVueFastMountId: vi.fn(() => false),
  mockTransformFastMountVueSource: vi.fn((code: string) => code),
}))

vi.mock('vite', () => ({
  normalizePath: (id: string) => id.replace(/\\/g, '/'),
}))

vi.mock('../src/plugin-helpers', () => ({
  getKeepBindingsFromId: mockGetKeepBindingsFromId,
  rewriteFastMountCallsites: mockRewriteFastMountCallsites,
  shouldTransformVueFastMountId: mockShouldTransformVueFastMountId,
  transformFastMountVueSource: mockTransformFastMountVueSource,
}))

import { vueFastMount } from '../src/plugin'

describe('plugin', () => {
  beforeEach(() => {
    mockGetKeepBindingsFromId.mockReset()
    mockGetKeepBindingsFromId.mockImplementation(() => new Set<string>())

    mockRewriteFastMountCallsites.mockReset()
    mockRewriteFastMountCallsites.mockImplementation((code: string) => code)

    mockShouldTransformVueFastMountId.mockReset()
    mockShouldTransformVueFastMountId.mockReturnValue(false)

    mockTransformFastMountVueSource.mockReset()
    mockTransformFastMountVueSource.mockImplementation((code: string) => code)
  })

  test('exposes plugin metadata', ({ expect }) => {
    const plugin = vueFastMount()

    expect(plugin.name).toBe('vue-fast-mount')
    expect(plugin.enforce).toBe('pre')
  })

  test('skips files in node_modules', ({ expect }) => {
    const plugin = vueFastMount()

    const result = (plugin.transform as any)?.('const value = 1', '/src/node_modules/pkg/index.ts')

    expect(result).toBeNull()
    expect(mockShouldTransformVueFastMountId).not.toHaveBeenCalled()
    expect(mockRewriteFastMountCallsites).not.toHaveBeenCalled()
  })

  test('delegates to callsite rewrite for non-vue fast-mount ids', ({ expect }) => {
    const plugin = vueFastMount()

    mockRewriteFastMountCallsites.mockReturnValueOnce('rewritten-code')

    const result = (plugin.transform as any)?.('input-code', '/src/spec.ts')

    expect(mockShouldTransformVueFastMountId).toHaveBeenCalledWith('/src/spec.ts')
    expect(mockRewriteFastMountCallsites).toHaveBeenCalledWith('input-code')
    expect(result).toBe('rewritten-code')
  })

  test('delegates to vue source transform for fast-mount ids', ({ expect }) => {
    const plugin = vueFastMount()

    mockShouldTransformVueFastMountId.mockReturnValueOnce(true)
    mockGetKeepBindingsFromId.mockReturnValueOnce(new Set(['Child']))
    mockTransformFastMountVueSource.mockReturnValueOnce('transformed-vue-code')

    const result = (plugin.transform as any)?.(
      'vue-input-code',
      '/src/Parent.vue?__vfm=1&__vfm_keep=Child',
    )

    expect(mockShouldTransformVueFastMountId).toHaveBeenCalledWith(
      '/src/Parent.vue?__vfm=1&__vfm_keep=Child',
    )
    expect(mockGetKeepBindingsFromId).toHaveBeenCalledWith(
      '/src/Parent.vue?__vfm=1&__vfm_keep=Child',
    )
    expect(mockTransformFastMountVueSource).toHaveBeenCalledWith(
      'vue-input-code',
      new Set(['Child']),
    )
    expect(result).toBe('transformed-vue-code')
  })

  test('returns null when helper returns unchanged source', ({ expect }) => {
    const plugin = vueFastMount()

    mockRewriteFastMountCallsites.mockReturnValueOnce('same-code')

    const result = (plugin.transform as any)?.('same-code', '/src/spec.ts')

    expect(result).toBeNull()
  })
})
