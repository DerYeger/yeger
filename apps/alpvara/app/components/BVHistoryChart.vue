<script setup lang="ts">
const { activities } = defineProps<{
  activities: BVActivity[]
}>()

defineOptions({
  tags: ['linecharts', 'singleline'],
})

function parseMonthIndex(month: string): number {
  const [year, monthNumber] = month.split('-').map(Number)
  return year! * 12 + (monthNumber! - 1)
}

function formatMonthIndex(monthIndex: number): string {
  const year = Math.floor(monthIndex / 12)
  const monthNumber = (monthIndex % 12) + 1
  return `${year}-${String(monthNumber).padStart(2, '0')}`
}

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
  // Fill gaps for missing months
  for (let i = data.length - 1; i > 0; i--) {
    const currentMonthIndex = parseMonthIndex(data[i]!.month)
    const previousMonthIndex = parseMonthIndex(data[i - 1]!.month)
    const monthDiff = currentMonthIndex - previousMonthIndex
    if (monthDiff > 1) {
      // Insert in reverse so splice-at-i keeps chronological order.
      for (let j = monthDiff - 1; j >= 1; j--) {
        const missingMonthStr = formatMonthIndex(previousMonthIndex + j)
        data.splice(i, 0, { month: missingMonthStr, value: data[i - 1]!.value })
      }
    }
  }
  if (data.length > 0) {
    // Add an initial point with 0 value one month before the first activity for better chart display
    const firstMonthIndex = parseMonthIndex(data[0]!.month)
    data.unshift({ month: formatMonthIndex(firstMonthIndex - 1), value: 0 })
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
  const [year, monthNumber] = month.split('-').map(Number)
  return monthFormat.value.format(new Date(year!, monthNumber! - 1, 1))
}

function xFormatter(tick: number): string {
  const month = chartData.value[tick]?.month
  if (!month) {
    return ''
  }
  return formatMonth(month)
}

function tooltipTitleFormatter(point: { month: string }): string {
  return formatMonth(point.month)
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
        :tooltip-title-formatter="tooltipTitleFormatter"
      />
    </div>
  </div>
</template>
