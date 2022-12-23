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
</script>

<template>
  <div
    class="flex flex-col justify-center items-center rounded w-fit h-fit p-2 text-white bg-stone-900 bg-op-25"
  >
    <code
      class="px-1 select-none text-sm"
      :class="{ 'cursor-pointer': children.length > 0 }"
      style="white-space: nowrap"
      @click="expanded = !expanded"
      >{{ expanded ? fragment.text() : fragment.toFormattedString() }}</code
    >
    <div
      v-if="expanded && children.length > 0"
      class="flex flex-row w-fit h-fit justify-evenly mt-2"
      :style="`gap: ${0.5 * (maxDepth - level) - 0.5}rem`"
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
