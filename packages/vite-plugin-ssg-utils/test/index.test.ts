import { describe, expect, it } from 'vitest'

import type { Options } from '~/index'
import SSGUtils from '~/index'

describe('The plugin', () => {
  it('installs a dummy ResizeObserver', () => {
    // eslint-disable-next-line no-restricted-globals
    expect(global.ResizeObserver).toBeUndefined()
    const options: Options = { resizeObserver: true }
    // @ts-expect-error We don't need a valid PluginContext to test this plugin
    SSGUtils(options).buildStart?.()
    expect(ResizeObserver).toBeDefined()
  })
})
