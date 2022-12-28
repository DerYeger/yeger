<script setup lang="ts">
import type { FOLFragment } from '@yeger/fol'

const props = defineProps<{
  fragment: FOLFragment
  level: number
  maxDepth: number
}>()
const { fragment, level, maxDepth } = toRefs(props)

const children = computed(() => fragment.value.children())
const expanded = ref(true)

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
      class="px-1 select-none"
      :class="{ 'cursor-pointer': children.length > 0 }"
      style="white-space: nowrap"
      @click="expanded = !expanded"
      >{{ expanded ? fragment.text() : fragment.toFormattedString() }}</code
    >
    <div
      v-if="expanded && children.length > 0"
      class="flex flex-row w-fit h-fit justify-evenly mt-2 gap-2"
    >
      <FOLTree
        v-for="(child, index) of children"
        :key="index"
        :fragment="child"
        :level="level + 1"
        :max-depth="maxDepth"
      />
    </div>
  </div>
</template>
