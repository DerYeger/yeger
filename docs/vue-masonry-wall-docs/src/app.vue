<script setup lang="ts">
import { MasonryWall, type NonEmptyArray } from '@yeger/vue-masonry-wall'
import { ref } from 'vue'

import DemoFooter from './demo-footer.vue'
import DemoHeader from './demo-header.vue'
import DemoTools from './demo-tools.vue'

const scrollContainer = ref(null)
const columnWidth = ref<number | NonEmptyArray<number>>([512, 256, 256])
const gap = ref(16)
const items = ref<{ height: number }[]>([])
const rtl = ref(false)
const useScrollContainer = ref(false)
const minColumns = ref(1)
const maxColumns = ref(5)

addItems()

function randomHeight() {
  return { height: Math.floor(Math.random() * (512 - 128 + 1)) + 128 }
}

function addItem(item: number) {
  items.value = [...items.value, { height: item }]
}

function addItems() {
  items.value = [
    ...items.value,
    randomHeight(),
    randomHeight(),
    randomHeight(),
    randomHeight(),
    randomHeight(),
    randomHeight(),
    randomHeight(),
    randomHeight(),
  ]
}

function removeItem(index: number) {
  items.value = items.value.filter((_, i) => i !== index)
}
</script>

<template>
  <div id="app">
    <DemoHeader />
    <main ref="scrollContainer" :class="{ 'scroll-container': useScrollContainer }">
      <DemoTools
        v-model:column-width="columnWidth"
        v-model:gap="gap"
        v-model:rtl="rtl"
        v-model:use-scroll-container="useScrollContainer"
        v-model:min-columns="minColumns"
        v-model:max-columns="maxColumns"
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
        <template #default="{ item, column, columnCount, row, index }">
          <div
            class="item"
            :class="{ secondary: index % 2 === 0, accent: index % 2 === 1 }"
            :style="`height: ${item.height}px;`"
          >
            <p>Index {{ index }}</p>
            <p>{{ `(${column + 1}/${columnCount}, ${row})` }}</p>
            <p style="text-align: center">Height {{ item.height }}px</p>
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
  overscroll-behavior: none;
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
