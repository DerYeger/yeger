<script setup lang="ts">
defineProps<{
  tooltip: string
}>()
</script>

<template>
  <InfoTooltip icon="hugeicons:alert-02" color="warning" class="m-0">
    {{ tooltip }}
  </InfoTooltip>
</template>
