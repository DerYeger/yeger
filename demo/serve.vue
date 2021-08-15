<template>
  <div id="app">
    <demo-header />
    <main>
      <div id="tools">
        <div class="row">
          <label for="width">Column Width</label>
          <input id="width" type="range" min="64" max="512" v-model="width" />
          <span> {{ width }}px</span>
        </div>
        <div class="row">
          <label for="padding">Padding</label>
          <input id="padding" type="range" min="0" max="128" v-model="padding" />
          <span> {{ padding }}px</span>
        </div>
        <div class="row">
          <label for="height">Height</label>
          <input id="height" type="range" min="16" max="512" v-model="newItemHeight" />
          <span> {{ newItemHeight }}px</span>
          <button @click="items.push(newItemHeight)">Create Item</button>
        </div>
      </div>
      <masonry-wall :items="items" :padding="`${padding}px`" :width="+width" :ssr-columns="1">
        <template #default="{ item, index }">
          <div class="item" :style="`height: ${item}px; background: var(--color-${index % 2 === 0 ? 'primary' : 'accent'})`">
            {{ item }}
          </div>
        </template>
      </masonry-wall>
    </main>
    <demo-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DemoFooter from './demo-footer.vue'
import DemoHeader from './demo-header.vue'
import MasonryWall from '@/masonry-wall.vue'

export default defineComponent({
  name: 'ServeDev',
  components: {
    DemoHeader,
    DemoFooter,
    MasonryWall,
  },
  data() {
    return {
      items: [100, 200, 150, 100],
      newItemHeight: 128,
      padding: 16,
      width: 300,
    }
  },
  created() {
    document.title = 'vue-masonry-wall'
    document.documentElement.setAttribute('lang', 'en')
    const metaElement = document.createElement('meta')
    metaElement.setAttribute('name', 'description')
    metaElement.content = 'Responsive masonry layout with SSR support and zero dependencies for Vue 3.'
    document.getElementsByTagName('head')[0].appendChild(metaElement)
  },
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

.item {
  display: flex;
  justify-content: center;
  align-items: center;
}

:root {
  --color-primary: #41b883;
  --color-secondary: #34495e;
  --color-accent: #a9a9a9;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

header,
main,
footer {
  padding: 1rem;
}

header {
  background: var(--color-primary);
}

header,
footer {
  color: white;
  text-align: center;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

#tools {
  display: flex;
  flex-direction: column;
}

#tools > div + div {
  margin-top: 0.5rem;
}

footer {
  background: var(--color-secondary);
  font-size: 0.75rem;
  padding: 0.75em;
}

main > * + div {
  margin-top: 1rem;
}

label + * {
  margin-left: 0.5rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.5rem;
}

.row > * {
  margin-left: 0.5rem;
  display: inline-block;
}

.subtitle {
  font-size: 1.25rem;
  font-style: italic;
}

a {
  text-decoration: none;
}

a:active,
a:hover,
a:link,
a:visited {
  color: white;
}
</style>
