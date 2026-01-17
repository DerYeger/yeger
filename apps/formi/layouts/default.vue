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
  <div class="min-h-full w-full bg-stone-100 p-4 font-sans text-stone-900 md:p-16">
    <header class="flex items-center gap-4 sm:gap-16">
      <span class="relative flex items-center gap-2 text-2xl font-bold">
        Formi
        <img
          src="/hero-first-small.webp"
          :width="48"
          :height="48"
          class="display-none md:display-block drop-shadow-custom mb--2 mt--3 select-none"
          :alt="accessibleDescription"
        />
      </span>
      <div class="flex-1" />
      <NuxtLink
        v-for="link of links"
        :key="link.to"
        :to="link.to"
        :title="link.text"
        class="font-300 text-xs uppercase md:text-sm"
        active-class="font-600"
      >
        {{ link.text }}
      </NuxtLink>
    </header>
    <main class="my-16 md:my-32">
      <slot />
    </main>
    <HLine class="w-100vw !w-100dvw ml--4 !bg-stone-400 md:ml--16" />
    <Footer />
  </div>
</template>
