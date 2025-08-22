<script setup lang="ts">
import TreeNode from './TreeNode.vue'

interface Props {
  label: string
  keyValue: readonly unknown[]
  level?: number
  partial?: boolean
}

defineProps<Props>()
</script>

<template>
  <TreeNode
    :level="level"
    :partial="partial"
    :key-value="keyValue"
    :icon="partial ? '📁' : '📄'"
    variant="static"
  >
    {{ label }}
  </TreeNode>
</template>
