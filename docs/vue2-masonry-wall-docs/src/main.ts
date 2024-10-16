import MasonryWall from '@yeger/vue2-masonry-wall'
import type { VNode } from 'vue'
import Vue from 'vue'

import App from './app.vue'

Vue.config.productionTip = false

// eslint-disable-next-line react-hooks/rules-of-hooks
Vue.use(MasonryWall)

new Vue({
  render: (h): VNode => h(App),
}).$mount('#app')
