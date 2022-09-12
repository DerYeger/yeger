import type { App, Plugin } from 'vue'

import component from '@/masonry-wall.vue'

type InstallableComponent = typeof component & Plugin

const MasonryWall: InstallableComponent =
  /* #__PURE__ */ ((): InstallableComponent => {
    const installable = component as unknown as InstallableComponent

    installable.install = (app: App) => {
      app.component('MasonryWall', installable)
    }

    return installable
  })()

export type Component = typeof component
export default MasonryWall
