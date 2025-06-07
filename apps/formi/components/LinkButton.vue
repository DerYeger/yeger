<script setup lang="ts">
import type { Link } from '~~/types/types'

const props = defineProps<{ link: Link, description?: string }>()

const { link, description } = toRefs(props)
</script>

<template>
  <NuxtLink
    :to="link.to"
    :aria-label="description ?? link.text"
    :title="link.text"
    :data-testid="`link-button-${link.to}`"
    class="md:text-md rounded-7 font-300 flex select-none items-center bg-stone-900 px-12 py-4 text-sm text-stone-100 transition-all duration-500 hover:bg-stone-700 hover:shadow-2xl"
  >
    <slot />
    <span v-if="description" class="sr-only">{{ description }}</span>
  </NuxtLink>
</template>
