<script setup lang="ts">
defineProps<{
  tooltip: string
}>()
</script>

<template>
  <UTooltip arrow :text="tooltip">
    <div class="flex items-center justify-center">
      <UIcon name="hugeicons:alert-02" class="size-6 text-yellow-500" />
    </div>
  </UTooltip>
</template>
