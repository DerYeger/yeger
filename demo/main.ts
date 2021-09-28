import { createApp } from 'vue'
import Dev from './app.vue'
import MasonryWall from '@/index'

createApp(Dev).use(MasonryWall).mount('#app')
