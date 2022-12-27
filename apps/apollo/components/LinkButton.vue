<script setup lang="ts">
import type { Link } from '~~/types/types'

const props = defineProps<{ link: Link }>()

const { link } = toRefs(props)
</script>

<template>
  <NuxtLink
    :to="link.to"
    class="flex items-center text-sm md:text-md px-12 py-4 rounded-7 bg-stone-900 text-stone-100 font-300 transition-colors hover:bg-stone-700"
  >
    <slot />
  </NuxtLink>
</template>
