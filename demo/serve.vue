<template>
  <div id="app">
    <demo-header />
    <main>
      <div id="tools">
        <section id="settings">
          <h2>Settings</h2>
          <div class="row">
            <label for="width">Column Width</label>
            <input id="width" type="range" min="128" max="512" v-model="columnWidth" />
            <span> {{ columnWidth }}px</span>
          </div>
          <div class="row">
            <label for="padding">Padding</label>
            <input id="padding" type="range" min="0" max="256" v-model="padding" />
            <span> {{ padding }}px</span>
          </div>
        </section>
        <section id="item-creation">
          <h2>New Item</h2>
          <div class="row">
            <label for="height">Height</label>
            <input id="height" type="range" min="128" max="512" v-model="newItemHeight" />
            <span> {{ newItemHeight }}px</span>
          </div>
          <div class="row button-row">
            <button class="primary" @click="addItem(newItemHeight)">Create</button>
            <button class="primary" @click="addItem(Math.floor(Math.random() * (512 - 128 + 1)) + 128)">Create Random</button>
          </div>
        </section>
      </div>
      <masonry-wall :items="items" :padding="+padding" :columnWidth="+columnWidth" :ssr-columns="1">
        <template #default="{ item, index }">
          <div class="item" :class="{ secondary: index % 2 === 0, accent: index % 2 === 1 }" :style="`height: ${item}px;`">
            <p>Index {{ index }}</p>
            <p style="text-align: center">Height {{ item }}px</p>
            <button class="primary" @click="removeItem(index)">Remove</button>
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
      items: [128, 256, 128],
      newItemHeight: 128,
      padding: 16,
      columnWidth: 400,
    }
  },
  methods: {
    addItem(item: number) {
      this.items = [...this.items, item]
    },
    removeItem(index: number) {
      this.items.splice(index, 1)
      this.items = [...this.items]
    },
  },
  created() {
    document.title = '@yeger/vue-masonry-wall'
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

:root {
  --color-primary: #379c6f;
  --color-secondary: #34495e;
  --color-accent: #666666;
  --shadow-base: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.primary {
  background: var(--color-primary);
  color: white;
}

.secondary {
  background: var(--color-secondary);
  color: white;
}

.accent {
  background: var(--color-accent);
  color: white;
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

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

#tools {
  display: flex;
  flex-direction: column;
}

#tools h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

#tools > section + section {
  margin-top: 1rem;
}

@media only screen and (min-width: 601px) {
  #tools {
    flex-direction: row;
  }

  #tools > section + section {
    margin-top: 0;
    margin-left: 2rem;
  }
}

@media only screen and (max-width: 369px) {
  #tools .row:not(.button-row) {
    flex-direction: column;
    align-items: start;
  }
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
  align-items: center;
  margin-left: -0.5rem;
}

.row > * {
  margin-left: 0.5rem;
  display: inline-block;
}

.row + .row {
  margin-top: 1rem;
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

button {
  border: none;
  border-radius: 4px;
  box-shadow: var(--shadow-base);
  cursor: pointer;
  padding: 0.5em 1em;
  transition: filter 0.25s ease;
}

button:focus-visible,
button:hover {
  filter: brightness(90%);
}

.item {
  border-radius: 4px;
  box-shadow: var(--shadow-base);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.item > * + * {
  margin-top: 0.25rem;
}

.item > p {
  margin-top: 0;
  margin-bottom: 0.25rem;
}

input[type='range'] {
  width: 10rem;
}
</style>
