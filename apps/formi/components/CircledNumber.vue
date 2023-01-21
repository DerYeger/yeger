<script setup lang="ts">
const props = defineProps<{ number: number }>()
const { number } = toRefs(props)
</script>

<template>
  <div
    class="border-1 rounded-10 w-1.25em h-1.25em font-200 flex select-none items-center justify-center border-stone-900"
  >
    <span class="text-0.875em">
      {{ number }}
    </span>
  </div>
</template>
