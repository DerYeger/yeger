<script setup lang="ts">
const { accessibleDescription } = useLogo()
</script>

<template>
  <figure
    v-once
    class="relative w-128 xl:w-172 max-w-full children:select-none"
  >
    <img
      src="/hero-first-medium.webp"
      :alt="accessibleDescription"
      class="drop-shadow-custom"
    />
    <img
      src="/hero-second-medium.webp"
      :alt="accessibleDescription"
      class="drop-shadow-custom absolute left-25% top-25%"
    />
    <figcaption class="invisible">{{ accessibleDescription }}</figcaption>
  </figure>
</template>
