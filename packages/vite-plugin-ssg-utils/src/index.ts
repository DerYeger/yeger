import { gray, yellow } from 'kolorist'
import type { Plugin } from 'vite'

export interface Options {
  /**
   * Use false to disable mocking of ResizeObserver.
   */
  resizeObserver: boolean | (new () => ResizeObserver)
}

function SSGUtils(options: Options = { resizeObserver: true }): Plugin {
  return {
    name: 'vite-plugin-ssg-utils',
    apply(config, { command }) {
      return command === 'build' && !config?.build?.ssr
    },
    buildStart() {
      setupResizeObserver(options)
    },
  }
}

function setupResizeObserver({ resizeObserver }: Options) {
  if (resizeObserver === false) {
    return
  }

  if (resizeObserver === true) {
    // eslint-disable-next-line no-restricted-globals
    global.ResizeObserver = class ResizeObserver {
      public constructor() {}
      public disconnect() {}
      public observe() {}
      public unobserve() {}
    }

    log('Using dummy ResizeObserver')
  } else {
    // eslint-disable-next-line no-restricted-globals
    global.ResizeObserver = resizeObserver

    log('Using provided ResizeObserver')
  }
}

function log(text: string) {
  // eslint-disable-next-line no-console
  console.log(`\n${gray('[vite-plugin-ssg-utils]')} ${yellow(text)}`)
}

export default SSGUtils
