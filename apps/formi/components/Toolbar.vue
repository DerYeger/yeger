<script setup lang="ts">
const props = defineProps<{ loading: boolean }>()
const { loading } = toRefs(props)

const { homeLink } = useLinks()
</script>

<template>
  <div
    class="border-b-1 flex h-6 items-center border-stone-600 bg-stone-200 p-2 text-stone-900 md:h-8"
  >
    <NuxtLink
      :to="homeLink.to"
      aria-label="Back to Home"
      title="Back to Home"
      class="m--1 flex h-7 w-7 items-center rounded-3xl p-1 transition-colors hover:bg-stone-400"
    >
      <Icon name="carbon:arrow-left" class="ml-1" />
    </NuxtLink>
    <div class="flex-1" />
    <Icon
      name="carbon:save"
      class="transition-color font-bold text-stone-900 duration-500"
      :class="{ 'text-stone-400': !loading }"
    />
  </div>
</template>
