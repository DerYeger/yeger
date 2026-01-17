<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'

const props = defineProps<{
  columnWidth: number | [number, ...number[]]
  gap: number
  rtl: boolean
  useScrollContainer: boolean
  minColumns: number
  maxColumns: number
}>()

const emit = defineEmits<{
  (e: 'clearItems'): void
  (e: 'createItem', height: number): void
  (e: 'createItems'): void
  (e: 'update:rtl', value: boolean): void
  (e: 'update:gap', value: number): void
  (e: 'update:columnWidth', value: number | [number, ...number[]]): void
  (e: 'update:useScrollContainer', value: boolean): void
  (e: 'update:minColumns', value: number): void
  (e: 'update:maxColumns', value: number): void
}>()

const { columnWidth, gap, rtl, useScrollContainer, minColumns, maxColumns } = toRefs(props)

const newItemHeight = ref(128)

const colWidth1 = ref(256)
const colWidth2 = ref(128)
const colWidth3 = ref(128)
const colWidth4 = ref(512)
const colWidth5 = ref(128)

watch([colWidth1, colWidth2, colWidth3, colWidth4, colWidth5], () => {
  const widths = [
    +colWidth1.value,
    +colWidth2.value,
    +colWidth3.value,
    +colWidth4.value,
    +colWidth5.value,
  ] as [number, ...number[]]
  emit('update:columnWidth', widths)
})

function randomHeight() {
  return Math.floor(Math.random() * (512 - 128 + 1)) + 128
}

function getWidthLabel(index: number) {
  const widths = columnWidth.value
  if (!Array.isArray(widths)) {
    return `${widths}px`
  }
  return `${widths[index % widths.length]}px`
}
</script>

<template>
  <div id="tools">
    <section id="settings">
      <h2>Settings</h2>
      <div class="row">
        <label for="gap">Gap</label>
        <input
          id="gap"
          type="range"
          min="0"
          max="256"
          :value="gap"
          @input="emit('update:gap', +($event.target as any).value)"
        />
        <span>{{ gap }}px</span>
      </div>
      <div class="row">
        <label for="min-columns">Min. Columns</label>
        <input
          id="min-columns"
          type="range"
          min="1"
          max="10"
          :value="minColumns"
          @input="emit('update:minColumns', +($event.target as any).value)"
        />
        <span>{{ minColumns }}</span>
      </div>
      <div class="row">
        <label for="max-columns">Max. Columns</label>
        <input
          id="max-columns"
          type="range"
          min="1"
          max="10"
          :value="maxColumns"
          @input="emit('update:maxColumns', +($event.target as any).value)"
        />
        <span>{{ maxColumns }}</span>
      </div>
      <div class="row">
        <label for="rtl">RTL</label>
        <input
          id="rtl"
          type="checkbox"
          :checked="rtl"
          @change="emit('update:rtl', ($event.target as any).checked)"
        />
      </div>
      <div class="row">
        <label for="useScrollContainer">Scroll Container</label>
        <input
          id="useScrollContainer"
          type="checkbox"
          :checked="useScrollContainer"
          @change="emit('update:useScrollContainer', ($event.target as any).checked)"
        />
      </div>
    </section>
    <section id="columns">
      <h2>Columns</h2>
      <div class="row">
        <label for="width">1st Column</label>
        <input id="width" v-model="colWidth1" type="range" min="128" max="512" />
        <span>{{ getWidthLabel(0) }}</span>
      </div>
      <div class="row">
        <label for="2nd-width">2nd Column</label>
        <input id="2nd-width" v-model="colWidth2" type="range" min="128" max="512" />
        <span>{{ getWidthLabel(1) }}</span>
      </div>
      <div class="row">
        <label for="3rd-width">3rd Column</label>
        <input id="3rd-width" v-model="colWidth3" type="range" min="128" max="512" />
        <span>{{ getWidthLabel(2) }}</span>
      </div>
      <div class="row">
        <label for="4th-width">4th Column</label>
        <input id="4th-width" v-model="colWidth4" type="range" min="128" max="512" />
        <span>{{ getWidthLabel(3) }}</span>
      </div>
      <div class="row">
        <label for="5th-width">5th Column</label>
        <input id="5th-width" v-model="colWidth5" type="range" min="128" max="512" />
        <span>{{ getWidthLabel(4) }}</span>
      </div>
    </section>
    <section id="item-creation">
      <h2>Items</h2>
      <div class="row">
        <label for="height">Height</label>
        <input id="height" v-model="newItemHeight" type="range" min="128" max="512" />
        <span>{{ newItemHeight }}px</span>
      </div>
      <div class="row button-row">
        <button class="primary" @click="emit('createItem', newItemHeight)">Create</button>
        <button class="primary" @click="emit('createItem', randomHeight())">Random</button>
        <button class="primary" @click="emit('createItems')">Random (10)</button>
        <button class="secondary" @click="emit('clearItems')">Clear</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
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

label + * {
  margin-left: 0.5rem;
}

.button-row {
  margin-top: -0.5rem;
}

.button-row button {
  margin-top: 0.5rem;
}

input[type='range'] {
  width: 10rem;
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
</style>
