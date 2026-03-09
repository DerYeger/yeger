<script setup lang="ts">
import type { Link } from '../types/types'

const props = defineProps<{ link: Link; description?: string }>()

const { link, description } = toRefs(props)
</script>

<template>
  <NuxtLink
    :to="link.to"
    :aria-label="description ?? link.text"
    :title="link.text"
    :data-testid="`link-button-${link.to}`"
    class="flex items-center rounded-[1.75rem] bg-stone-900 px-12 py-4 text-sm font-light text-stone-100 transition-all duration-500 select-none hover:bg-stone-700 hover:shadow-2xl md:text-base"
  >
    <slot />
    <span v-if="description" class="sr-only">{{ description }}</span>
  </NuxtLink>
</template>
