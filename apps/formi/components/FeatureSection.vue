<script setup lang="ts">
const props = defineProps<{ title: string; number: number }>()
const { title, number } = toRefs(props)
</script>

<template>
  <section>
    <div
      class="text-xl sm:text-2xl md:text-3xl flex justify-center items-center mb-16 gap-4"
    >
      <HLine />
      <CircledNumber :number="number" />
      <h2>{{ title }}</h2>
      <HLine />
    </div>
    <slot />
  </section>
</template>
