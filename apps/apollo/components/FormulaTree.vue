<script setup lang="ts">
import type { TreeNode } from '@yeger/fol'

const props = defineProps<{ tree: TreeNode; level: number; maxDepth: number }>()
const { tree, level, maxDepth } = toRefs(props)

const children = computed(() => tree.value.children())
</script>

<template>
  <div
    class="flex flex-col items-center min-w-fit bg-op-25 bg-stone-900 overflow-hidden h-fit p-2 text-white"
    :class="{ rounded: level > 0 }"
  >
    <code class="px-2">{{ tree.text() }}</code>
    <div
      v-if="children.length > 0"
      class="flex flex-row w-full justify-evenly mt-2"
      :style="`gap: ${maxDepth - level}rem`"
    >
      <FormulaTree
        v-for="(child, index) of children"
        :key="index"
        :tree="child"
        :level="level + 1"
        :max-depth="maxDepth"
      />
    </div>
  </div>
</template>
