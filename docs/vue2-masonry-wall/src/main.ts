import MasonryWall from '@yeger/vue2-masonry-wall'
import type { VNode } from 'vue'
import Vue from 'vue'

import App from './app.vue'

Vue.config.productionTip = false

Vue.use(MasonryWall)

new Vue({
  render: (h): VNode => h(App),
}).$mount('#app')
