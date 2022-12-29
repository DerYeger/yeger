<script setup lang="ts">
const { homeLink } = useLinks()
</script>

<template>
  <div
    class="bg-stone-200 h-6 md:h-8 flex items-center p-2 text-stone-900 border-b-1 border-stone-600"
  >
    <NuxtLink
      :to="homeLink.to"
      class="flex items-center w-7 h-7 p-1 m--1 rounded-3xl hover:bg-stone-400 transition-colors"
    >
      <Icon name="carbon:arrow-left" class="ml-1" />
    </NuxtLink>
  </div>
</template>
