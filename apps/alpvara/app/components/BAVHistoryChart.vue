<script setup lang="ts">
const { activities } = defineProps<{
  activities: BAVActivity[]
}>()

defineOptions({
  tags: ['linecharts', 'singleline'],
})

const chartData = computed(() => {
  const data: { month: string; value: number }[] = []
  for (let i = activities.length - 1; i >= 0; i--) {
    const activity = activities[i]!
    const activityValue = activity.price * activity.shares
    data.push({
      month: activity.datetime.slice(0, 7), // Extract YYYY-MM for x-axis
      value: activityValue,
    })
  }
  for (let i = 1; i < data.length; i++) {
    data[i]!.value += data[i - 1]!.value
  }
  return data
})

const categories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  value: { name: $t('bav.history.balance'), color: '#22c55e' },
}))

const MONTH_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', year: '2-digit' })
function formatMonth(month: string) {
  return MONTH_FORMAT.format(new Date(month))
}

function xFormatter(tick: number): string {
  return formatMonth(chartData.value[tick]!.month)
}

const VALUE_FORMAT = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' })
function formatValue(value: number): string {
  return VALUE_FORMAT.format(value)
}

function yFormatter(tick: number): string {
  return formatValue(tick)
}
</script>

<template>
  <LineChart
    :data="chartData"
    :height="300"
    :categories="categories"
    :y-num-ticks="4"
    :y-formatter="yFormatter"
    :x-num-ticks="12"
    :x-formatter="xFormatter"
    :curve-type="CurveType.Step"
    hide-legend
    :y-grid-line="true"
    :tooltip-title-formatter="({ month }) => formatMonth(month)"
  />
</template>
