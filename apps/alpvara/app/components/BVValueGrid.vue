<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'

const { values } = defineProps<{
  values: {
    color: ChipProps['color']
    label: string
    value: number
  }[]
}>()

const sortedValues = computed(() => {
  return [...values].sort((a, b) => b.value - a.value)
})
</script>

<template>
  <div class="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1">
    <BVValueRow
      v-for="value of sortedValues"
      :key="value.label"
      :color="value.color"
      :label="value.label"
      :value="value.value"
    />
    <slot />
  </div>
</template>
