<script setup lang="ts">
import './forbiddenModule'

defineProps<{
  childProp?: string
  isActive?: boolean
}>()

defineEmits<{
  (e: 'childEvent', payload: string): void
}>()
</script>

<template>
  <div>
    Child
    <slot />
    <slot name="named" />
  </div>
</template>
