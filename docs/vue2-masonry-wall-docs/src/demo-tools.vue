<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DemoTools',
  props: {
    columnWidth: {
      type: Array,
      required: true,
    },
    gap: {
      type: Number,
      required: true,
    },
    rtl: {
      type: Boolean,
      required: true,
    },
    useScrollContainer: {
      type: Boolean,
      required: true,
    },
    minColumns: {
      type: Number,
      required: true,
    },
    maxColumns: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'update:column-width',
    'update:gap',
    'update:rtl',
    'update:use-scroll-container',
    'update:min-columns',
    'update:max-columns',
    'create-item',
    'create-items',
    'clear-items',
  ],
  data() {
    return {
      colWidth1: 256,
      colWidth2: 128,
      colWidth3: 128,
      colWidth4: 512,
      colWidth5: 128,
      newItemHeight: 128,
    }
  },
  computed: {
    columnWidths(): [number, ...number[]] {
      return [
        +this.colWidth1,
        +this.colWidth2,
        +this.colWidth3,
        +this.colWidth4,
        +this.colWidth5,
      ] as [number, ...number[]]
    },
  },
  watch: {
    columnWidths() {
      this.$emit('update:column-width', this.columnWidths)
    },
  },
  methods: {
    randomHeight(): number {
      return Math.floor(Math.random() * (512 - 128 + 1)) + 128
    },
    getWidthLabel(index: number) {
      const columnWidth = this.columnWidth
      const widths = Array.isArray(columnWidth) ? columnWidth : [columnWidth]
      return `${widths[index % widths.length]}px`
    },
  },
})
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
          @input="$emit('update:gap', +$event.target.value)"
        >
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
          @input="$emit('update:min-columns', +$event.target.value)"
        >
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
          @input="$emit('update:max-columns', +$event.target.value)"
        >
        <span>{{ maxColumns }}</span>
      </div>
      <div class="row">
        <label for="rtl">RTL</label>
        <input
          id="rtl"
          type="checkbox"
          :checked="rtl"
          @change="$emit('update:rtl', $event.target.checked)"
        >
      </div>
      <div class="row">
        <label for="useScrollContainer">Scroll Container</label>
        <input
          id="useScrollContainer"
          type="checkbox"
          :checked="useScrollContainer"
          @change="$emit('update:use-scroll-container', $event.target.checked)"
        >
      </div>
    </section>
    <section id="columns">
      <h2>Columns</h2>
      <div class="row">
        <label for="width">1st Column</label>
        <input
          id="width"
          v-model="colWidth1"
          type="range"
          min="128"
          max="512"
        >
        <span>{{ getWidthLabel(0) }}</span>
      </div>
      <div class="row">
        <label for="2nd-width">2nd Column</label>
        <input
          id="2nd-width"
          v-model="colWidth2"
          type="range"
          min="128"
          max="512"
        >
        <span>{{ getWidthLabel(1) }}</span>
      </div>
      <div class="row">
        <label for="3rd-width">3rd Column</label>
        <input
          id="3rd-width"
          v-model="colWidth3"
          type="range"
          min="128"
          max="512"
        >
        <span>{{ getWidthLabel(2) }}</span>
      </div>
      <div class="row">
        <label for="4th-width">4th Column</label>
        <input
          id="4th-width"
          v-model="colWidth4"
          type="range"
          min="128"
          max="512"
        >
        <span>{{ getWidthLabel(3) }}</span>
      </div>
      <div class="row">
        <label for="5th-width">5th Column</label>
        <input
          id="5th-width"
          v-model="colWidth5"
          type="range"
          min="128"
          max="512"
        >
        <span>{{ getWidthLabel(4) }}</span>
      </div>
    </section>
    <section id="item-creation">
      <h2>New Item</h2>
      <div class="row">
        <label for="height">Height</label>
        <input
          id="height"
          v-model="newItemHeight"
          type="range"
          min="128"
          max="512"
        >
        <span>{{ newItemHeight }}px</span>
      </div>
      <div class="row button-row">
        <button class="primary" @click="$emit('create-item', newItemHeight)">
          Create
        </button>
        <button class="primary" @click="$emit('create-item', randomHeight())">
          Random
        </button>
        <button class="primary" @click="$emit('create-items')">
          Random (10)
        </button>
        <button class="secondary" @click="$emit('clear-items')">
          Clear
        </button>
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
