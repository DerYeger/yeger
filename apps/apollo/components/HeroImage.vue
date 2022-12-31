<script setup lang="ts">
const { accessibleDescription } = useLogo()
</script>

<template>
  <figure
    v-once
    class="relative mt-12.5% mb--12.5% md:ml-12.5% w-72 sm:w-96 md:w-128 xl:w-172 pb-100% max-w-full children:select-none"
  >
    <img
      src="/hero-first.webp"
      :alt="accessibleDescription"
      class="drop-shadow-custom absolute translate-x--12.5% translate-y--12.5%"
      sizes="sm:512px md:512px xl:688px"
    />
    <img
      src="/hero-second.webp"
      :alt="accessibleDescription"
      class="drop-shadow-custom absolute translate-x-12.5% translate-y-12.5%"
      sizes="sm:512px md:512px xl:688px"
    />
    <figcaption class="display-none">{{ accessibleDescription }}</figcaption>
  </figure>
</template>
