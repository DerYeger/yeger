<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui'

defineProps<{
  color: ChipProps['color']
  label: string
  value: number
}>()

const currencyFormat = useCurrencyFormat()
</script>

<template>
  <UChip standalone inset :color="color" />
  <div class="text-sm">
    {{ label }}
  </div>
  <div class="tabular text-right text-sm font-semibold">
    {{ currencyFormat.format(value) }}
  </div>
</template>
