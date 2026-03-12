<script setup lang="ts">
defineProps<{
  href: string
}>()
</script>

<template>
  <ULink :href="href" external target="_blank" class="inline-flex items-center underline">
    <slot />
    <UIcon name="hugeicons:arrow-up-right-01" />
  </ULink>
</template>
