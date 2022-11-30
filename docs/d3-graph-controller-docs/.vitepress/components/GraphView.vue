<script lang="ts" setup>
import { GraphController } from 'd3-graph-controller'
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue'
import 'd3-graph-controller/default.css'

import type { DemoGraph, DemoGraphConfig } from '../demo/model'

const props = defineProps<{
  graph: DemoGraph
  config: DemoGraphConfig
}>()

const { graph, config } = toRefs(props)

const el = ref<HTMLDivElement>()

const controller = ref<GraphController | undefined>()

const maxWeight = ref(5)

onMounted(() => {
  resetGraphController()
})

onUnmounted(() => {
  controller.value?.shutdown()
})

watch([graph, config], resetGraphController)

watch(maxWeight, (value) => {
  if (!controller.value) {
    return
  }
  controller.value.linkFilter = (link) => link.weight <= value
})

function resetGraphController() {
  controller.value?.shutdown()
  if (!graph.value || !config.value || !el.value) {
    return
  }
  controller.value = new GraphController(el.value!, graph.value, config.value)
}
</script>

<template>
  <div>
    <div class="settings card">
      <button @click="resetGraphController()">Reset</button>
      <div>
        <label for="maxWeight">Link Filter: {{ maxWeight }}</label>
        <input
          id="maxWeight"
          v-model="maxWeight"
          type="range"
          min="0"
          max="5"
        />
      </div>
      <div>
        <span>Included Node Types</span>
        <div
          v-for="type of controller?.nodeTypes"
          :key="type"
          class="type-checkbox"
        >
          <input
            :id="`type-${type}`"
            type="checkbox"
            :checked="controller?.nodeTypeFilter.includes(type)"
            @change="
              controller?.filterNodesByType($event.currentTarget.checked, type)
            "
          />
          <label :for="`type-${type}`">{{ type }}</label>
        </div>
      </div>
    </div>
    <div ref="el" class="host card" />
  </div>
</template>

<style scoped>
.card {
  overflow: hidden;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
}

.host {
  flex-grow: 1;

  --text-on-node: var(--vp-c-text-1);
  --text-on-link: var(--vp-c-sponsor);

  --color-primary: #6eb897;
  --color-secondary: #a2b1c7;
  --color-background: #141414;
  --color-node-stroke: black;
  --text-on-surface: black;
  --text-on-primary: black;
  --text-on-secondary: black;
}

html.dark .host {
  --text-on-node: var(--vp-c-text-1);
  --text-on-link: var(--vp-c-sponsor);

  --color-primary: #349469;
  --color-secondary: #505b6d;
  --color-background: #141414;
  --color-node-stroke: white;
  --text-on-surface: white;
  --text-on-primary: white;
  --text-on-secondary: white;
}

.settings {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: fit-content;
  padding: 1rem;
}

.settings input[type='range'] {
  width: 100%;
}

.type-checkbox {
  align-items: center;
  display: flex;
  gap: 0.25em;
}

.type-checkbox > label {
  text-transform: capitalize;
}

button {
  color: var(--vp-c-brand-dark);
  font-weight: 600;
}
</style>
