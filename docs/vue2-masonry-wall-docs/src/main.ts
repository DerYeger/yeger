import type { VNode } from 'vue'
import Vue from 'vue'

import App from './app.vue'

Vue.config.productionTip = false

new Vue({
  render: (h): VNode => h(App),
}).$mount('#app')
