<script setup lang="ts">
import { ref } from 'vue'

import { demoGraph, demoGraphConfig } from '../demo/model'
import { generateRandomGraph, randomGraphConfig } from '../demo/random-graph'
const graph = ref(demoGraph)
const config = ref(demoGraphConfig)

function useDemoGraph() {
  config.value = demoGraphConfig
  graph.value = demoGraph
}

function useRandomGraph() {
  config.value = randomGraphConfig
  graph.value = generateRandomGraph()
}
</script>

<template>
  <div class="graph-select-buttons">
    <button @click="useDemoGraph()">Example</button>
    <button @click="useRandomGraph()">Random</button>
  </div>
  <GraphView :graph="graph" :config="config" class="graph-view" />
</template>

<style>
.content > .content-container {
  width: 100%;
}

.container > .aside {
  display: none !important;
}

.graph {
  border: 1px solid var(--c-border);
  margin-top: 1rem;
  height: 100%;
  width: 100%;
}

.graph-view {
  margin-top: 1rem;
  height: 600px;
}
</style>

<style scoped>
.graph-select-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.graph-select-buttons > button {
  color: var(--vp-c-brand-dark);
  font-weight: 600;
}
</style>
