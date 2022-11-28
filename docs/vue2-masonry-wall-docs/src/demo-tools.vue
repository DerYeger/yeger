<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DemoTools',
  props: {
    columnWidth: {
      type: Number,
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
  },
  data() {
    return {
      newItemHeight: 128,
    }
  },
  methods: {
    randomHeight(): number {
      return Math.floor(Math.random() * (512 - 128 + 1)) + 128
    },
  },
})
</script>

<template>
  <div id="tools">
    <section id="settings">
      <h2>Settings</h2>
      <div class="row">
        <label for="width">Column Width</label>
        <input
          id="width"
          type="range"
          min="128"
          max="512"
          :value="columnWidth"
          @input="$emit('update:columnWidth', +$event.target.value)"
        />
        <span>{{ columnWidth }}px</span>
      </div>
      <div class="row">
        <label for="gap">Gap</label>
        <input
          id="gap"
          type="range"
          min="0"
          max="256"
          :value="gap"
          @input="$emit('update:gap', +$event.target.value)"
        />
        <span>{{ gap }}px</span>
      </div>
      <div class="row">
        <label for="rtl">RTL</label>
        <input
          id="rtl"
          type="checkbox"
          :checked="rtl"
          @change="$emit('update:rtl', $event.target.checked)"
        />
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
        />
        <span>{{ newItemHeight }}px</span>
      </div>
      <div class="row button-row">
        <button class="primary" @click="$emit('create-item', newItemHeight)">
          Create
        </button>
        <button class="primary" @click="$emit('create-item', randomHeight())">
          Random
        </button>
        <button class="secondary" @click="$emit('clear-items')">Clear</button>
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
