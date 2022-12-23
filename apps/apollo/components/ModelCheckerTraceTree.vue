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
    class="flex flex-col justify-center items-center rounded w-fit h-fit p-2 text-white bg-stone-900 bg-op-25"
  >
    <code
      class="px-2 py-1 select-none rounded border-1 text-sm"
      :class="{
        'cursor-pointer': children.length > 0,
        'bg-red-600': trace.actual !== trace.expected,
        'bg-green-600': trace.actual === trace.expected,
        'border-green-800': trace.actual === trace.expected,
        'border-red-800': trace.actual !== trace.expected,
      }"
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
