<script setup lang="ts">
const props = defineProps<{ title: string }>()
const { title } = toRefs(props)
</script>

<template>
  <div class="flex flex-col gap-2 text-sm font-300 text-stone-600">
    <span class="font-400 text-stone-900 mb-4">{{ title }}</span>
    <slot />
  </div>
</template>
