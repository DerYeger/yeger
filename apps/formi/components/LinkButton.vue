<script setup lang="ts">
import type { Link } from '~~/types/types'

const props = defineProps<{ link: Link; description?: string }>()

const { link, description } = toRefs(props)
</script>

<template>
  <NuxtLink
    :to="link.to"
    :aria-label="description ?? link.text"
    :title="link.text"
    class="flex items-center text-sm md:text-md px-12 py-4 rounded-7 bg-stone-900 text-stone-100 font-300 transition-all hover:bg-stone-700 select-none hover:shadow-2xl duration-500"
  >
    <slot />
    <span v-if="description" class="sr-only">{{ description }}</span>
  </NuxtLink>
</template>
