<script setup lang="ts">
const { links } = useLinks()
</script>

<template>
  <div class="bg-stone-100 text-stone-900 min-h-full p-4 md:p-16">
    <header class="flex items-center gap-4 md:gap-16 overflow-x-auto">
      <span class="text-2xl font-bold">Apollo</span>
      <div class="flex-1" />
      <NuxtLink
        v-for="link of links"
        :key="link.to"
        :to="link.to"
        class="font-300 uppercase text-xs md:text-sm"
        active-class="font-600"
      >
        {{ link.text }}
      </NuxtLink>
    </header>
    <main class="my-16 md:my-32">
      <slot />
    </main>
  </div>
</template>
