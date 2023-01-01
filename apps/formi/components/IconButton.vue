<script setup lang="ts">
const props = defineProps<{ name: string }>()
const emit = defineEmits(['click'])
const { name } = toRefs(props)
</script>

<template>
  <button
    class="transition-colors rounded-3xl w-7 h-7 p-1 m--1 hover:bg-stone-300 hover:text-stone-600 flex justify-center items-center"
    @click="emit('click')"
  >
    <Icon :name="name" />
  </button>
</template>
