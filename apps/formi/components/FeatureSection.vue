<script setup lang="ts">
const props = defineProps<{ title: string, number: number }>()
const { title, number } = toRefs(props)
</script>

<template>
  <section>
    <div
      class="mb-16 flex items-center justify-center gap-4 text-xl sm:text-2xl md:text-3xl"
    >
      <HLine />
      <CircledNumber :number="number" />
      <h2>{{ title }}</h2>
      <HLine />
    </div>
    <slot />
  </section>
</template>
