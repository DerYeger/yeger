<script setup lang="ts">
import './forbiddenModule'

defineProps<{
  childProp?: string
}>()

defineEmits<{
  (e: 'childEvent', payload: string): void
}>()
</script>

<template>
  <div>Child</div>
</template>
