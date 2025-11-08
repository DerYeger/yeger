import { flushPromises } from '@vue/test-utils'
import { onTestFinished } from 'vitest'
import type { App, Plugin } from 'vue'
import { createApp } from 'vue'

export interface Options {
  plugins?: Plugin[]
  autoCleanup?: boolean
}

/**
 * Test a composable with an actual vue lifecycle.
 * This function may be used to run onMounted, etc hooks.
 */
export function withVueComponentLifecycle<T>(
  composable: () => T,
  options: Options = {},
): { result: T; app: App; cleanup: () => Promise<void> } {
  const { plugins = [], autoCleanup = true } = options
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })
  plugins.forEach((plugin) => app.use(plugin))
  app.mount(document.createElement('div'))

  const cleanup = async () => {
    app.unmount()
    await flushPromises()
  }

  if (autoCleanup) {
    onTestFinished(cleanup)
  }

  return {
    // @ts-expect-error We know that result will be assigned
    result,
    app,
    cleanup: autoCleanup
      ? () => {
          throw new Error('Auto cleanup is enabled, no manual cleanup is possible')
        }
      : cleanup,
  }
}
