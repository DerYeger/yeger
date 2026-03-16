<script setup lang="ts">
defineProps<{
  tooltip: string
}>()
</script>

<template>
  <InfoTooltip icon="hugeicons:alert-02" color="warning">
    {{ tooltip }}
  </InfoTooltip>
</template>
