import { createApp } from 'vue'
import { MarmosetViewer } from 'vue-marmoset-viewer'

import App from '~/app.vue'

createApp(App).use(MarmosetViewer).mount('#app')
