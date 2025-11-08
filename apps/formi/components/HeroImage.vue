<script setup lang="ts">
const { accessibleDescription } = useLogo()
</script>

<template>
  <figure
    v-once
    class="mt-12.5% mb--12.5% md:ml-12.5% md:w-128 xl:w-172 pb-100% children:select-none relative w-72 max-w-full sm:w-96 md:mt-0"
  >
    <img
      src="/hero-first.webp"
      :alt="accessibleDescription"
      class="drop-shadow-custom translate-x--12.5% translate-y--12.5% absolute"
      sizes="sm:512px md:512px xl:688px"
    />
    <img
      src="/hero-second.webp"
      :alt="accessibleDescription"
      class="drop-shadow-custom translate-x-12.5% translate-y-12.5% absolute"
      sizes="sm:512px md:512px xl:688px"
    />
    <figcaption class="sr-only">
      {{ accessibleDescription }}
    </figcaption>
  </figure>
</template>
