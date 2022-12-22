<script setup lang="ts">
import type { ModelCheckerTrace } from '@yeger/fol'

const props = defineProps<{
  trace: ModelCheckerTrace
  level: number
  maxDepth: number
}>()
const { trace, level, maxDepth } = toRefs(props)

const children = computed(() => trace.value.children())
const expanded = ref(trace.value?.actual === trace.value?.expected)
</script>

<template>
  <div
    class="flex flex-col justify-center items-center rounded w-fit h-fit p-2 text-white border-1 inline-flex"
    :class="{
      'bg-red-500': trace.actual !== trace.expected,
      'bg-green-500': trace.actual === trace.expected,
      'border-green-600': trace.actual === trace.expected,
      'border-red-600': trace.actual !== trace.expected,
    }"
  >
    <code
      class="px-2 select-none"
      :class="{ 'cursor-pointer': children.length > 0 }"
      style="white-space: nowrap"
      @click="expanded = !expanded"
      >{{ expanded ? trace.text() : trace.details() }}</code
    >
    <div
      v-if="expanded && children.length > 0"
      class="flex flex-row w-fit h-fit justify-evenly mt-2"
      :style="`gap: ${0.5 * (maxDepth - level)}rem`"
    >
      <ModelCheckerTraceTree
        v-for="(child, index) of children"
        :key="index"
        :trace="child"
        :level="level + 1"
        :max-depth="maxDepth"
      />
    </div>
  </div>
</template>
