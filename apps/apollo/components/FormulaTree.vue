<script setup lang="ts">
import type { TreeNode } from '@yeger/fol'

const props = defineProps<{ tree: TreeNode; level: number }>()

const { tree, level } = toRefs(props)
</script>

<template>
  <div class="children:inline">
    <pre v-if="level > 0" :style="`padding-left: ${level + 1}rem`">↳</pre>
    <pre class="pl-4">{{ tree.symbol }}</pre>
  </div>
  <FormulaTree
    v-for="(child, index) of tree.children"
    :key="index"
    :tree="child"
    :level="level + 1"
  />
</template>
