<script setup lang="ts">
import type { ModelCheckerTrace } from '@yeger/fol'

const props = defineProps<{
  trace: ModelCheckerTrace
  level: number
  maxDepth: number
  isRootMismatched: boolean
}>()
const { trace, level, maxDepth, isRootMismatched } = toRefs(props)

const children = computed(() => trace.value.children())
const isMismatched = computed(() => trace.value.actual !== trace.value.expected)
const expanded = ref(
  isRootMismatched.value ? isMismatched.value : !isMismatched.value
)
</script>

<template>
  <div
    class="flex flex-col justify-center items-center rounded w-fit h-fit p-2 text-white bg-stone-900 bg-op-25"
  >
    <code
      class="px-2 py-1 select-none rounded border-1 text-sm"
      :class="{
        'cursor-pointer': children.length > 0,
        'bg-red-600': isMismatched,
        'border-red-800': isMismatched,
        'bg-green-600': !isMismatched,
        'border-green-800': !isMismatched,
      }"
      style="white-space: nowrap"
      @click="expanded = !expanded"
      >{{ expanded ? trace.text() : trace.details() }}</code
    >
    <div
      v-if="expanded && children.length > 0"
      class="flex flex-row w-fit h-fit justify-evenly mt-2 gap-2"
    >
      <ModelCheckerTraceTree
        v-for="(child, index) of children"
        :key="index"
        :trace="child"
        :level="level + 1"
        :max-depth="maxDepth"
        :is-root-mismatched="isRootMismatched"
      />
    </div>
  </div>
</template>
