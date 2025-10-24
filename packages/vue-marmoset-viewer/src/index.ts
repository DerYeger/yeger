import type { App, Plugin } from 'vue'

import component from './marmoset-viewer.vue'

type InstallableComponent = typeof component & Plugin

export const MarmosetViewer: InstallableComponent =
  /* #__PURE__ */ ((): InstallableComponent => {
    const installable = component as unknown as InstallableComponent

    installable.install = (app: App) => {
      app.component('MarmosetViewer', installable)
    }

    return installable
  })()

export { loadMarmoset, marmosetScriptId } from './marmoset'
