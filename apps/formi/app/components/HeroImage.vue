<script setup lang="ts">
const { accessibleDescription } = useLogo()
</script>

<template>
  <figure
    v-once
    class="relative mt-[12.5%] -mb-[12.5%] w-72 max-w-full pb-[100%] sm:w-96 md:mt-0 md:ml-[12.5%] md:w-[32rem] xl:w-[43rem] [&>*]:select-none"
  >
    <img
      src="/hero-first.webp"
      :alt="accessibleDescription"
      class="drop-shadow-custom absolute -translate-x-[12.5%] -translate-y-[12.5%]"
      sizes="sm:512px md:512px xl:688px"
    />
    <img
      src="/hero-second.webp"
      :alt="accessibleDescription"
      class="drop-shadow-custom absolute translate-x-[12.5%] translate-y-[12.5%]"
      sizes="sm:512px md:512px xl:688px"
    />
    <figcaption class="sr-only">
      {{ accessibleDescription }}
    </figcaption>
  </figure>
</template>
