<script setup lang="ts">
const { links } = useLinks()
</script>

<template>
  <div
    class="bg-stone-100 text-stone-900 min-h-full p-4 md:p-16 font-sans w-full"
  >
    <header class="flex items-center gap-4 md:gap-16">
      <span class="text-2xl font-bold relative">
        <img
          src="/hero-first-small.webp"
          class="w-16 h-16 absolute right--20 top--5 display-none md:display-block drop-shadow-custom"
        />
        Apollo
      </span>
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
    <HLine class="!bg-stone-400 w-100vw ml--16" />
    <Footer />
  </div>
</template>
