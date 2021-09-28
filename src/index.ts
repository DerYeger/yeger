import { App, Plugin } from 'vue'

// Import vue component
import component from '@/masonry-wall.vue'

// Define typescript interfaces for installable component
type InstallableComponent = typeof component & Plugin

// Default export is installable instance of component.
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),
const MasonryWall: InstallableComponent =
  /*#__PURE__*/ ((): InstallableComponent => {
    // Assign InstallableComponent type
    const installable: InstallableComponent =
      component as unknown as InstallableComponent

    // Attach install function executed by Vue.use()
    installable.install = (app: App) => {
      app.component('MasonryWall', installable)
    }
    return installable as InstallableComponent
  })()

export default MasonryWall

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
