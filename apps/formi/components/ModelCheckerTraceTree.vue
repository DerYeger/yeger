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

const borderBreakpoints = [1, 3, 5]
</script>

<template>
  <div
    class="flex flex-col justify-center items-center rounded w-fit h-fit p-2 text-stone-100 bg-stone-900 bg-op-25 border-1 shadow"
    :class="{
      'border-stone-600': level < borderBreakpoints[0],
      'border-stone-700': level >= borderBreakpoints[0],
      'border-stone-800': level >= borderBreakpoints[1],
      'border-stone-900': level >= borderBreakpoints[2],
    }"
  >
    <code
      class="px-2 py-1 select-none rounded flex items-center gap-2"
      :class="{
        'cursor-pointer': children.length > 0,
      }"
      style="white-space: nowrap"
      @click="expanded = !expanded"
    >
      <Icon
        :name="trace.actual ? 'mdi:check-bold' : 'mdi:close-thick'"
        class="text-1.25em"
        :class="{
          'text-green-500': !isMismatched,
          'text-red-500': isMismatched,
        }"
      />
      {{ expanded ? trace.text() : trace.details() }}
    </code>
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