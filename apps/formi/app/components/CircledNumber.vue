<script setup lang="ts">
const props = defineProps<{ number: number }>()
const { number } = toRefs(props)
</script>

<template>
  <div
    class="flex h-[1.25em] w-[1.25em] items-center justify-center rounded-full border border-stone-900 font-extralight select-none"
  >
    <span class="text-[0.875em]">
      {{ number }}
    </span>
  </div>
</template>
