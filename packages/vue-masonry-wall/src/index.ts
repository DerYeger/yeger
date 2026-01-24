import type { App, Plugin } from 'vue'

import component from './masonry-wall.vue'

export type MasonryWallComponent = typeof component

// oxlint-disable-next-line typescript/no-redundant-type-constituents
type MasonryWallPlugin = MasonryWallComponent & Plugin

const MasonryWall: MasonryWallPlugin =
  /* #__PURE__ */ ((): MasonryWallPlugin => {
    const installable = component as unknown as MasonryWallPlugin

    installable.install = (app: App) => {
      app.component('MasonryWall', installable)
    }

    return installable
  })()

declare module 'vue' {
  export interface GlobalComponents {
    MasonryWall: MasonryWallComponent
  }
}

export default MasonryWall
