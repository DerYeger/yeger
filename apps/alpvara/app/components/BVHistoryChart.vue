<script setup lang="ts">
const { activities } = defineProps<{
  activities: BVActivity[]
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
  if (data.length > 0) {
    const firstMonth = data[0]!.month
    const previousMonth = new Date(new Date(firstMonth + '-01').getTime() - 1)
    data.unshift({ month: previousMonth.toISOString().slice(0, 7), value: 0 })
  }
  return data
})

const categories = computed<Record<string, BulletLegendItemInterface>>(() => ({
  value: { name: $t('bv.history.contributions'), color: '#22c55e' },
}))

const { locale } = useI18n()

const monthFormat = computed(
  () => new Intl.DateTimeFormat(locale.value, { month: 'short', year: '2-digit' }),
)
function formatMonth(month: string) {
  return monthFormat.value.format(new Date(month))
}

function xFormatter(tick: number): string {
  const month = chartData.value[tick]?.month
  if (!month) {
    return ''
  }
  return formatMonth(month)
}

const valueFormat = computed(
  () => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'EUR' }),
)
function formatValue(value: number): string {
  return valueFormat.value.format(value)
}

function yFormatter(tick: number): string {
  return formatValue(tick)
}

const containerSize = useElementSize(useTemplateRef('container'))
</script>

<template>
  <div ref="container" class="relative min-h-50 flex-1">
    <div v-if="containerSize.height.value !== 0" class="absolute inset-0">
      <LineChart
        :data="chartData"
        :height="containerSize.height.value"
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
    </div>
  </div>
</template>
