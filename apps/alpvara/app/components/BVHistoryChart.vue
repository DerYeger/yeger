<script setup lang="ts">
import type { EChartsOption, SeriesOption } from 'echarts'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { LegendComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([LegendComponent, LineChart, GridComponent, TooltipComponent, CanvasRenderer])

const { activities } = defineProps<{
  activities: BVActivity[]
}>()

defineOptions({
  tags: ['linecharts', 'multiline'],
})

const chartData = computed(() => {
  const data: { month: string; contributions: number; balance: number }[] = []
  let cumulativeContributions = 0
  let cumulativeShares = 0

  for (let i = activities.length - 1; i >= 0; i--) {
    const activity = activities[i]!
    cumulativeContributions += activity.price * activity.shares
    cumulativeShares += activity.shares

    const parsedQuote = Number.parseFloat(activity.description ?? '')
    const monthlyQuote =
      Number.isFinite(parsedQuote) && parsedQuote > 0 ? parsedQuote : activity.price

    data.push({
      month: activity.datetime.slice(0, 7), // Extract YYYY-MM for x-axis
      contributions: cumulativeContributions,
      balance: cumulativeShares * monthlyQuote,
    })
  }

  if (data.length > 0) {
    // Add an initial point with 0 value one month before the first activity for better chart display
    const [year, monthNumber] = data[0]!.month.split('-').map(Number)
    if (year && monthNumber) {
      const firstMonthDate = new Date(Date.UTC(year, monthNumber - 1, 1))
      firstMonthDate.setUTCMonth(firstMonthDate.getUTCMonth() - 1)
      const initialMonth = `${firstMonthDate.getUTCFullYear()}-${String(firstMonthDate.getUTCMonth() + 1).padStart(2, '0')}`
      data.unshift({ month: initialMonth, contributions: 0, balance: 0 })
    }
  }

  return data
})

const { locale } = useI18n()

const monthFormat = computed(
  () => new Intl.DateTimeFormat(locale.value, { month: 'short', year: '2-digit' }),
)
function formatMonth(month: string) {
  const [year, monthNumber] = month.split('-').map(Number)
  return monthFormat.value.format(new Date(year!, monthNumber! - 1, 1))
}

const valueFormat = computed(
  () => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'EUR' }),
)
function formatValue(value: number): string {
  return valueFormat.value.format(value)
}

function tooltipRow(label: string, value: string, color: string): string {
  return [
    '<div class="flex items-center justify-between gap-4">',
    '<div class="flex min-w-0 items-center gap-2">',
    `<span class="h-2 w-2 shrink-0 rounded-full" style="background:${color}"></span>`,
    `<span class="text-xs text-neutral-600">${label}</span>`,
    '</div>',
    `<span class="text-right text-xs font-bold tabular">${value}</span>`,
    '</div>',
  ].join('')
}

function yFormatter(tick: number): string {
  return formatValue(tick)
}

const COLORS = {
  contributions: '#737373', // neutral 500
  balancePositive: '#22c55e', // green 500
  balanceNegative: '#ef4444', // red 500
}

const chartOptions = computed<EChartsOption>(() => {
  const months = chartData.value.map((point) => point.month)
  const contributions = chartData.value.map((point) => point.contributions)
  const balance = chartData.value.map((point) => point.balance)
  const balanceSegments: SeriesOption[] = []
  for (let i = 1; i < chartData.value.length; i++) {
    const segmentData = Array.from<number | null>({ length: chartData.value.length }).fill(null)
    segmentData[i - 1] = balance[i - 1]!
    segmentData[i] = balance[i]!

    const startDelta = balance[i - 1]! - contributions[i - 1]!
    const endDelta = balance[i]! - contributions[i]!
    const segmentColor =
      startDelta + endDelta >= 0 ? COLORS.balancePositive : COLORS.balanceNegative

    balanceSegments.push({
      type: 'line',
      data: segmentData,
      connectNulls: false,
      showSymbol: false,
      symbol: 'none',
      lineStyle: {
        width: 2,
        color: segmentColor,
      },
      silent: true,
      tooltip: {
        show: false,
      },
      emphasis: {
        disabled: true,
      },
      z: 3,
    })
  }

  return {
    animation: false,
    grid: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    tooltip: {
      trigger: 'axis',
      appendTo: document.body,
      formatter: (params) => {
        const first = Array.isArray(params) ? params[0] : params
        const month = String((first as any)?.axisValue ?? '')
        const point = chartData.value.find((entry) => entry.month === month)
        if (!point) {
          return ''
        }

        const contributionsColor = COLORS.contributions
        const balanceColor =
          point.balance - point.contributions >= 0 ? COLORS.balancePositive : COLORS.balanceNegative

        return [
          `<div class="mb-2 text-xs font-semibold">${formatMonth(point.month)}</div>`,
          '<div class="flex flex-col gap-1">',
          tooltipRow(
            String($t('bv.history.contributions')),
            formatValue(point.contributions),
            contributionsColor,
          ),
          tooltipRow(
            String($t('bv.history.account-value')),
            formatValue(point.balance),
            balanceColor,
          ),
          '</div>',
        ].join('')
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: (value: string) => formatMonth(value),
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      splitNumber: 4,
      axisLabel: {
        formatter: (value: number) => yFormatter(value),
      },
      splitLine: {
        show: true,
      },
    },
    series: [
      {
        name: $t('bv.history.contributions'),
        type: 'line',
        step: 'middle',
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: COLORS.contributions,
        },
        data: contributions,
        z: 2,
      },
      ...balanceSegments,
    ],
    legend: {
      show: false,
    },
  }
})
</script>

<template>
  <div ref="container" class="relative min-h-50 flex-1">
    <div class="absolute inset-0">
      <ClientOnly>
        <VChart :option="chartOptions" autoresize class="h-full w-full" />
      </ClientOnly>
    </div>
  </div>
</template>
