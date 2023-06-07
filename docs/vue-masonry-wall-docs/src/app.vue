<script lang="ts">
import { defineComponent, ref } from 'vue'

import DemoFooter from '~/demo-footer.vue'
import DemoHeader from '~/demo-header.vue'
import DemoTools from '~/demo-tools.vue'

export default defineComponent({
  name: 'App',
  components: {
    DemoFooter,
    DemoHeader,
    DemoTools,
  },
  setup() {
    const scrollContainer = ref(null)
    return {
      scrollContainer,
    }
  },
  data() {
    return {
      columnWidth: 300,
      gap: 16,
      items: [] as number[],
      rtl: false,
      useScrollContainer: false,
      minColumns: 1,
      maxColumns: 8,
    }
  },
  mounted() {
    this.addItems()
  },
  methods: {
    randomHeight(): number {
      return Math.floor(Math.random() * (512 - 128 + 1)) + 128
    },
    addItem(item: number) {
      this.items = [...this.items, item]
    },
    addItems() {
      this.items = [
        ...this.items,
        this.randomHeight(),
        this.randomHeight(),
        this.randomHeight(),
        this.randomHeight(),
        this.randomHeight(),
        this.randomHeight(),
        this.randomHeight(),
        this.randomHeight(),
        this.randomHeight(),
        this.randomHeight(),
      ]
    },
    removeItem(index: number) {
      this.items.splice(index, 1)
      this.items = [...this.items]
    },
  },
})
</script>

<template>
  <div id="app">
    <DemoHeader />
    <main
      ref="scrollContainer"
      :class="{ 'scroll-container': useScrollContainer }"
    >
      <DemoTools
        v-model:column-width="columnWidth"
        v-model:gap="gap"
        v-model:rtl="rtl"
        v-model:useScrollContainer="useScrollContainer"
        v-model:minColumns="minColumns"
        v-model:maxColumns="maxColumns"
        @create-item="addItem($event)"
        @create-items="addItems()"
        @clear-items="items = []"
      />
      <MasonryWall
        :items="items"
        :column-width="columnWidth"
        :gap="gap"
        :rtl="rtl"
        :scroll-container="useScrollContainer ? scrollContainer : undefined"
        :min-columns="minColumns"
        :max-columns="maxColumns"
      >
        <template #default="{ item, column, row, index }">
          <div
            class="item"
            :class="{ secondary: index % 2 === 0, accent: index % 2 === 1 }"
            :style="`height: ${item}px;`"
          >
            <p>Index {{ index }}</p>
            <p>{{ `(${column}, ${row})` }}</p>
            <p style="text-align: center">Height {{ item }}px</p>
            <button class="primary" @click="removeItem(index)">Remove</button>
          </div>
        </template>
      </MasonryWall>
    </main>
    <DemoFooter />
  </div>
</template>

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

p {
  margin-bottom: 1rem;
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

main > * + div {
  margin-top: 1rem;
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
  transition: color 0.25s ease;
}

a:active,
a:link,
a:visited {
  color: white;
}

a:focus-visible,
a:hover {
  color: var(--color-primary);
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

.scroll-container {
  overflow-y: auto;
}
</style>
