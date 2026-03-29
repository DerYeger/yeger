<script setup lang="ts">
defineProps<{}>()

const { chartData } = useBVHistoryChart()

const latestData = computed(() => chartData.value.at(-1))

const monthFormat = useMonthFormat('long')

const currencyFormat = useCurrencyFormat()

const formattedDiff = computed(() => {
  if (!latestData.value) {
    return null
  }
  const diff = latestData.value.balance - latestData.value.contributions
  const sign = diff > 0 ? '+' : ''
  return `${sign}${currencyFormat.value.format(diff)}`
})
</script>

<template>
  <UCard v-if="latestData">
    <template #header>
      {{ monthFormat.format(new Date(latestData.month)) }}
    </template>
    <BVValueGrid
      :values="[
        {
          color:
            latestData.balance >= latestData.contributions
              ? ('success' as const)
              : ('error' as const),
          label: $t('bv.history.balance'),
          value: latestData.balance,
        },
        {
          color: 'neutral' as const,
          label: $t('bv.history.contributions'),
          value: latestData.contributions,
        },
      ]"
    >
      <template v-if="formattedDiff">
        <div class="col-span-3 text-right text-sm font-semibold whitespace-pre tabular-nums">
          {{ formattedDiff }}
        </div>
      </template>
    </BVValueGrid>
  </UCard>
</template>
