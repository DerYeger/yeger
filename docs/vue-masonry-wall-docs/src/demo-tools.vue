<script setup lang="ts">
import type { NonEmptyArray } from '@yeger/vue-masonry-wall'
import { computed, ref } from 'vue'

const columnWidth = defineModel<number | NonEmptyArray<number>>('columnWidth', {
  required: true,
})

const DEFAULT_WIDTH = 256

type InternalColumnWidth =
  | {
      type: 'single'
      value: number
    }
  | {
      type: 'list'
      value: NonEmptyArray<number>
    }

const internalColumnWidth = computed<InternalColumnWidth>({
  get: (): InternalColumnWidth => {
    if (Array.isArray(columnWidth.value)) {
      return { type: 'list', value: columnWidth.value }
    }
    return { type: 'single', value: columnWidth.value }
  },
  set(newValue: InternalColumnWidth) {
    columnWidth.value = newValue.value
  },
})

const widthMode = computed<InternalColumnWidth['type']>({
  get() {
    return internalColumnWidth.value.type
  },
  set(newMode) {
    if (newMode === 'single' && internalColumnWidth.value.type === 'list') {
      internalColumnWidth.value = { type: 'single', value: internalColumnWidth.value.value[0]! }
    } else if (newMode === 'list' && internalColumnWidth.value.type === 'single') {
      internalColumnWidth.value = { type: 'list', value: [internalColumnWidth.value.value] }
    }
  },
})

const singleWidthModeValue = computed({
  get() {
    return internalColumnWidth.value.type === 'single'
      ? internalColumnWidth.value.value
      : DEFAULT_WIDTH
  },
  set(newValue: number) {
    if (internalColumnWidth.value.type === 'single') {
      internalColumnWidth.value = { type: 'single', value: newValue }
    }
  },
})

const gap = defineModel<number>('gap', { required: true })

const rtl = defineModel<boolean>('rtl', { required: true })

const useScrollContainer = defineModel<boolean>('useScrollContainer', { required: true })

const minColumns = defineModel<number>('minColumns', { required: true })

const maxColumns = defineModel<number>('maxColumns', { required: true })

const emit = defineEmits<{
  (e: 'clearItems'): void
  (e: 'createItem', height: number): void
  (e: 'createItems'): void
}>()

const newItemHeight = ref(128)

function randomHeight() {
  return Math.floor(Math.random() * (512 - 128 + 1)) + 128
}

function getWidthLabel(index: number) {
  const value =
    internalColumnWidth.value.type === 'single'
      ? internalColumnWidth.value.value
      : internalColumnWidth.value.value[index % internalColumnWidth.value.value.length]!
  return `${value}px`
}

function addWidth() {
  if (internalColumnWidth.value.type === 'single') {
    return
  }
  const currentWidths = internalColumnWidth.value.value
  const width = currentWidths.at(-1) ?? DEFAULT_WIDTH
  internalColumnWidth.value = { ...internalColumnWidth.value, value: [...currentWidths, width] }
}

function removeWidth() {
  if (internalColumnWidth.value.type !== 'list' || internalColumnWidth.value.value.length <= 1) {
    return
  }
  internalColumnWidth.value = {
    ...internalColumnWidth.value,
    value: internalColumnWidth.value.value.slice(0, -1) as NonEmptyArray<number>,
  }
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
          @input="gap = +($event.target as any).value"
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
          @input="minColumns = +($event.target as any).value"
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
          @input="maxColumns = +($event.target as any).value"
        />
        <span>{{ maxColumns }}</span>
      </div>
      <div class="row">
        <label for="rtl">RTL</label>
        <input
          id="rtl"
          type="checkbox"
          :checked="rtl"
          @change="rtl = ($event.target as any).checked"
        />
      </div>
      <div class="row">
        <label for="useScrollContainer">Scroll Container</label>
        <input
          id="useScrollContainer"
          type="checkbox"
          :checked="useScrollContainer"
          @change="useScrollContainer = ($event.target as any).checked"
        />
      </div>
    </section>
    <section id="columns">
      <h2>Columns</h2>
      <div class="row">
        <label for="width-mode">Width Mode</label>
        <select id="width-mode" v-model="widthMode">
          <option value="single">Single</option>
          <option value="list">List</option>
        </select>
      </div>
      <div v-if="internalColumnWidth.type === 'single'" class="row">
        <label for="single-width">Column Width</label>
        <input
          id="single-width"
          v-model.number="singleWidthModeValue"
          type="range"
          min="128"
          max="512"
        />
        <span>{{ singleWidthModeValue }}px</span>
      </div>
      <template v-else>
        <div class="row button-row">
          <button class="primary" @click="addWidth">Add</button>
          <button
            :class="{
              secondary: internalColumnWidth.value.length > 1,
              accent: internalColumnWidth.value.length <= 1,
            }"
            @click="removeWidth"
          >
            Remove
          </button>
          <span>{{ internalColumnWidth.value.length }} columns</span>
        </div>
        <div v-for="(_, index) in internalColumnWidth.value" :key="index" class="row">
          <label :for="`width-${index + 1}`">Column {{ index + 1 }}</label>
          <input
            :id="`width-${index + 1}`"
            v-model.number="internalColumnWidth.value[index]"
            type="range"
            min="128"
            max="512"
          />
          <span>{{ getWidthLabel(index) }}</span>
        </div>
      </template>
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
