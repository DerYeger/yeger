<script setup lang="ts">
const props = defineProps<{ title: string }>()
const { title } = toRefs(props)
</script>

<template>
  <div class="font-300 flex flex-col gap-2 text-sm text-stone-600">
    <span class="font-400 mb-4 text-stone-900">{{ title }}</span>
    <slot />
  </div>
</template>
