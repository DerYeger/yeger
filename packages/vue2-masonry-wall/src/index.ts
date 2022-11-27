import type { PluginObject } from 'vue'
import type _Vue from 'vue'

import component from '~/masonry-wall.vue'

type InstallableComponent = typeof component & PluginObject<never>

const MasonryWall: InstallableComponent =
  /* #__PURE__ */ ((): InstallableComponent => {
    const installable = component as unknown as InstallableComponent

    installable.install = (Vue: typeof _Vue) => {
      Vue.component('MasonryWall', installable)
    }

    return installable
  })()

export default MasonryWall
