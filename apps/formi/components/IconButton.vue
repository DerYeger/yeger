<script setup lang="ts">
const props = defineProps<{ name: string }>()
const emit = defineEmits(['click'])
const { name } = toRefs(props)
</script>

<template>
  <button
    class="m--1 flex h-7 w-7 items-center justify-center rounded-3xl p-1 transition-colors hover:bg-stone-300 hover:text-stone-600"
    @click="emit('click')"
  >
    <Icon :name="name" />
  </button>
</template>
