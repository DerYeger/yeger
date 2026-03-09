<script setup lang="ts">
const props = defineProps<{ title: string }>()
const { title } = toRefs(props)
</script>

<template>
  <div class="flex flex-col gap-2 text-sm font-light text-stone-600">
    <span class="mb-4 font-normal text-stone-900">{{ title }}</span>
    <slot />
  </div>
</template>
