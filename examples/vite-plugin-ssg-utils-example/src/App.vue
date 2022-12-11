<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const container = ref<HTMLDivElement>()
const size = ref([0, 0])

const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
  size.value = [contentRect.width, contentRect.height]
})

onMounted(() => resizeObserver.observe(container.value!))

onBeforeUnmount(() => resizeObserver.unobserve(container.value!))
</script>

<template>
  <div ref="container" class="container">
    {{ `${size[0]} x ${size[1]}` }}
  </div>
</template>

<style>
* {
  height: 100%;
  margin: 0;
  width: 100%;
}

.container {
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
