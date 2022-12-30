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
      <span class="text-2xl font-bold relative flex items-center gap-2">
        Apollo
        <img
          src="/hero-first-small.webp"
          :width="48"
          :height="48"
          class="mt--3 mb--2 display-none md:display-block drop-shadow-custom select-none"
          :alt="accessibleDescription"
        />
      </span>
      <div class="flex-1" />
      <NuxtLink
        v-for="link of links"
        :key="link.to"
        :to="link.to"
        :title="link.text"
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
