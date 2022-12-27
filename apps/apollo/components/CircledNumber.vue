<script setup lang="ts">
const props = defineProps<{ number: number }>()
const { number } = toRefs(props)
</script>

<template>
  <div
    class="border-1 border-stone-900 rounded-10 w-1.25em h-1.25em flex items-center justify-center font-100"
  >
    <span class="text-0.875em">
      {{ number }}
    </span>
  </div>
</template>
