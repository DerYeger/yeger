<script setup lang="ts">
const { links } = useLinks()

useHead({
  meta: [{ name: 'theme-color', content: '#f5f5f4' }],
  htmlAttrs: {
    class: 'bg-stone-100',
  },
})

const { accessibleDescription } = useLogo()
</script>

<template>
  <div
    class="bg-stone-100 text-stone-900 min-h-full p-4 md:p-16 font-sans w-full"
  >
    <header class="flex items-center gap-4 sm:gap-16">
      <span class="text-2xl font-bold relative">
        <img
          src="/hero-first-small.webp"
          class="w-16 h-16 absolute right--20 top--5 display-none md:display-block drop-shadow-custom select-none"
          :alt="accessibleDescription"
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
    <HLine class="!bg-stone-400 w-100vw !w-100dvw ml--4 md:ml--16" />
    <Footer />
  </div>
</template>
