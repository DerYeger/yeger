/* eslint-disable no-restricted-globals */
import { afterEach, describe, expect, it } from 'vitest'

import type { Options } from '../src/index'
import SSGUtils from '../src/index'

describe('The plugin', () => {
  afterEach(() => {
    // @ts-expect-error Clean up global ResizeObserver after each test
    delete global.ResizeObserver
  })

  describe('applicability', () => {
    it('applies only during build for client-side code', () => {
      const plugin = SSGUtils()

      expect(
        // @ts-expect-error We don't need a valid config to test this plugin
        plugin.apply?.({}, { command: 'build' }),
      ).toBe(true)

      expect(
        // @ts-expect-error We don't need a valid config to test this plugin
        plugin.apply?.({ build: { ssr: false } }, { command: 'build' }),
      ).toBe(true)

      expect(
        // @ts-expect-error We don't need a valid config to test this plugin
        plugin.apply?.({ build: { ssr: true } }, { command: 'build' }),
      ).toBe(false)

      expect(
        // @ts-expect-error We don't need a valid config to test this plugin
        plugin.apply?.({}, { command: 'serve' }),
      ).toBe(false)
    })
  })

  it('installs a dummy ResizeObserver', () => {
    expect(global.ResizeObserver).toBeUndefined()
    const options: Options = { resizeObserver: true }
    // @ts-expect-error We don't need a valid PluginContext to test this plugin
    SSGUtils(options).buildStart?.()
    expect(ResizeObserver).toBeDefined()
  })

  it('can disable ResizeObserver mocking', () => {
    expect(global.ResizeObserver).toBeUndefined()
    const options: Options = { resizeObserver: false }
    // @ts-expect-error We don't need a valid PluginContext to test this plugin
    SSGUtils(options).buildStart?.()
    expect(() => ResizeObserver).toThrow('ResizeObserver is not defined')
  })

  it('can use a custom ResizeObserver', () => {
    expect(global.ResizeObserver).toBeUndefined()

    class CustomResizeObserver {
      public constructor() {}
      public disconnect() {}
      public observe() {}
      public unobserve() {}
    }
    const options: Options = { resizeObserver: CustomResizeObserver }
    // @ts-expect-error We don't need a valid PluginContext to test this plugin
    SSGUtils(options).buildStart?.()
    expect(ResizeObserver).toBe(CustomResizeObserver)
  })
})
