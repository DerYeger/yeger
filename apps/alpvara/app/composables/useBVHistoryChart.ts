import type { EChartsOption, SeriesOption } from 'echarts'

type ChartDataPoint = {
  month: string
  contributions: number
  balance: number
}

type ProjectionDataPoint = {
  month: string
  contributions: number
  expected: number
  pessimistic: number
  optimistic: number
}

export const useBVHistoryChart = createGlobalState(() => {
  const activities = shallowRef<BVActivity[]>([])
  const projection = useBVProjection()
  const { t } = useI18n()

  const chartData = computed<ChartDataPoint[]>(() => {
    const data: ChartDataPoint[] = []
    let cumulativeContributions = 0
    let cumulativeShares = 0

    for (let i = activities.value.length - 1; i >= 0; i--) {
      const activity = activities.value[i]!
      cumulativeContributions += activity.price * activity.shares
      cumulativeShares += activity.shares

      const parsedQuote = Number.parseFloat(activity.description ?? '')
      const monthlyQuote =
        Number.isFinite(parsedQuote) && parsedQuote > 0 ? parsedQuote : activity.price

      data.push({
        month: activity.datetime.slice(0, 7),
        contributions: cumulativeContributions,
        balance: cumulativeShares * monthlyQuote,
      })
    }

    if (data.length > 0) {
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

  const projectionData = computed<ProjectionDataPoint[]>(() => {
    const state = projection.debouncedState.value
    if (!state?.enabled || !chartData.value.length) {
      return []
    }

    const projectionMonths = state.years * 12
    if (projectionMonths <= 0) {
      return []
    }

    const monthlyContribution = state.annualContribution / 12
    const expectedMonthlyRate = toMonthlyRate(state.annualReturn)
    const pessimisticMonthlyRate = toMonthlyRate(state.pessimisticAnnualReturn)
    const optimisticMonthlyRate = toMonthlyRate(state.optimisticAnnualReturn)

    const lastActual = chartData.value.at(-1)
    if (!lastActual) {
      return []
    }

    let expectedBalance = lastActual.balance
    let pessimisticBalance = lastActual.balance
    let optimisticBalance = lastActual.balance
    let projectedContributions = lastActual.contributions

    const baseDate = parseMonthKey(lastActual.month)
    const points: ProjectionDataPoint[] = []

    for (let i = 1; i <= projectionMonths; i++) {
      const nextDate = new Date(baseDate)
      nextDate.setUTCMonth(baseDate.getUTCMonth() + i)

      projectedContributions += monthlyContribution
      expectedBalance = (expectedBalance + monthlyContribution) * (1 + expectedMonthlyRate)
      pessimisticBalance = (pessimisticBalance + monthlyContribution) * (1 + pessimisticMonthlyRate)
      optimisticBalance = (optimisticBalance + monthlyContribution) * (1 + optimisticMonthlyRate)

      points.push({
        month: toMonthKey(nextDate),
        contributions: projectedContributions,
        expected: expectedBalance,
        pessimistic: pessimisticBalance,
        optimistic: optimisticBalance,
      })
    }

    return points
  })

  const lastHistoryPoint = computed(() => chartData.value.at(-1))
  const lastProjectionPoint = computed(() => projectionData.value.at(-1))

  const finalValue = computed(
    () => lastProjectionPoint.value?.expected ?? lastHistoryPoint.value?.balance ?? 0,
  )

  const finalValueText = computed(() => formatValue(finalValue.value))

  const monthFormat = useMonthFormat()

  const percentFormat = usePercentFormat()

  function setActivities(value: BVActivity[]): void {
    activities.value = value
  }

  function formatMonth(month: string): string {
    const [year, monthNumber] = month.split('-').map(Number)
    return monthFormat.value.format(new Date(year!, monthNumber! - 1, 1))
  }

  const currencyFormat = useCurrencyFormat()

  function formatValue(value: number): string {
    return currencyFormat.value.format(value)
  }

  function formatPercent(value: number): string {
    return percentFormat.value.format(value)
  }

  function yFormatter(tick: number): string {
    return formatValue(tick)
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

  const chartOptions = computed<EChartsOption>(() => {
    const actualMonths = chartData.value.map((point) => point.month)
    const projectionMonths = projectionData.value.map((point) => point.month)
    const months = [...actualMonths, ...projectionMonths]
    const projectionStartIndex = Math.max(0, chartData.value.length - 1)
    const contributions = chartData.value.map((point) => point.contributions)
    const balance = chartData.value.map((point) => point.balance)
    const projectedContributions = Array.from<number | null>({ length: months.length }).fill(null)
    const expectedProjection = Array.from<number | null>({ length: months.length }).fill(null)
    const pessimisticProjection = Array.from<number | null>({ length: months.length }).fill(null)
    const optimisticProjection = Array.from<number | null>({ length: months.length }).fill(null)

    const lastActual = chartData.value.at(-1)
    if (projectionData.value.length && lastActual) {
      projectedContributions[projectionStartIndex] = lastActual.contributions
      expectedProjection[projectionStartIndex] = lastActual.balance
      pessimisticProjection[projectionStartIndex] = lastActual.balance
      optimisticProjection[projectionStartIndex] = lastActual.balance

      for (let i = 0; i < projectionData.value.length; i++) {
        const point = projectionData.value[i]!
        const monthIndex = projectionStartIndex + i + 1
        projectedContributions[monthIndex] = point.contributions
        expectedProjection[monthIndex] = point.expected
        pessimisticProjection[monthIndex] = point.pessimistic
        optimisticProjection[monthIndex] = point.optimistic
      }
    }

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
        color: segmentColor,
        data: segmentData,
        connectNulls: false,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: segmentColor,
        },
        tooltip: {
          show: false,
        },
        z: 3,
      })
    }

    const state = projection.debouncedState.value

    const expectedLabel = `${t('bv.projection.expected')} (${formatPercent(state.annualReturn)})`
    const optimisticLabel = `${t('bv.projection.optimistic')} (${formatPercent(state.optimisticAnnualReturn)})`
    const pessimisticLabel = `${t('bv.projection.pessimistic')} (${formatPercent(state.pessimisticAnnualReturn)})`

    const projectionSeries: SeriesOption[] =
      projectionData.value.length > 0
        ? [
            {
              name: expectedLabel,
              type: 'line',
              color: COLORS.expectedProjection,
              data: expectedProjection,
              showSymbol: false,
              connectNulls: false,
              lineStyle: {
                width: 2,
                type: 'dashed',
                color: COLORS.expectedProjection,
              },
              z: 5,
            },
            {
              name: optimisticLabel,
              type: 'line',
              color: COLORS.balancePositive,
              data: optimisticProjection,
              showSymbol: false,
              connectNulls: false,
              lineStyle: {
                width: 2,
                type: 'dashed',
                color: COLORS.balancePositive,
              },
              z: 4,
            },
            {
              name: pessimisticLabel,
              type: 'line',
              color: COLORS.balanceNegative,
              data: pessimisticProjection,
              showSymbol: false,
              connectNulls: false,
              lineStyle: {
                width: 2,
                type: 'dashed',
                color: COLORS.balanceNegative,
              },
              z: 4,
            },
            {
              name: t('bv.history.contributions'),
              type: 'line',
              color: COLORS.contributions,
              data: projectedContributions,
              showSymbol: false,
              connectNulls: false,
              lineStyle: {
                width: 2,
                type: 'dashed',
                color: COLORS.contributions,
              },
              z: 4,
            },
          ]
        : []

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
          const month = first?.name
          if (!month) {
            return ''
          }
          const historyPoint = chartData.value.find((entry) => entry.month === month)
          const projectionPoint = projectionData.value.find((entry) => entry.month === month)
          if (!historyPoint && !projectionPoint) {
            return ''
          }

          const rows: string[] = []

          if (historyPoint) {
            const contributionsColor = COLORS.contributions
            const isPositiveBalance = historyPoint.balance >= historyPoint.contributions
            const balanceColor = isPositiveBalance ? COLORS.balancePositive : COLORS.balanceNegative
            const balanceRow = tooltipRow(
              String(t('bv.history.contributions')),
              formatValue(historyPoint.contributions),
              contributionsColor,
            )
            const contributionsRow = tooltipRow(
              String(t('bv.history.balance')),
              formatValue(historyPoint.balance),
              balanceColor,
            )
            if (isPositiveBalance) {
              rows.push(contributionsRow, balanceRow)
            } else {
              rows.push(balanceRow, contributionsRow)
            }
          }

          if (projectionPoint) {
            const rawRows: [number, string][] = [
              [
                projectionPoint.optimistic,
                tooltipRow(
                  optimisticLabel,
                  formatValue(projectionPoint.optimistic),
                  COLORS.balancePositive,
                ),
              ],
              [
                projectionPoint.expected,
                tooltipRow(
                  expectedLabel,
                  formatValue(projectionPoint.expected),
                  COLORS.expectedProjection,
                ),
              ],
              [
                projectionPoint.pessimistic,
                tooltipRow(
                  pessimisticLabel,
                  formatValue(projectionPoint.pessimistic),
                  COLORS.balanceNegative,
                ),
              ],
              [
                projectionPoint.contributions,
                tooltipRow(
                  String(t('bv.history.contributions')),
                  formatValue(projectionPoint.contributions),
                  COLORS.contributions,
                ),
              ],
            ]
            const sortedRows = rawRows.sort((a, b) => b[0] - a[0]).map((entry) => entry[1])
            rows.push(...sortedRows)
          }

          return [
            `<div class="mb-2 text-xs font-semibold">${formatMonth(month)}</div>`,
            '<div class="flex flex-col gap-1">',
            ...rows,
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
          name: t('bv.history.contributions'),
          type: 'line',
          color: COLORS.contributions,
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
        ...projectionSeries,
      ],
    }
  })

  return {
    activities,
    chartData,
    projectionData,
    lastHistoryPoint,
    lastProjectionPoint,
    finalValue,
    finalValueText,
    chartOptions,
    setActivities,
    formatValue,
  }
})

function parseMonthKey(month: string): Date {
  const [year, monthNumber] = month.split('-').map(Number)
  return new Date(Date.UTC(year!, monthNumber! - 1, 1))
}

function toMonthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

function toMonthlyRate(annualRate: number): number {
  return (1 + annualRate) ** (1 / 12) - 1
}

const COLORS = {
  contributions: '#737373',
  expectedProjection: '#3b82f6',
  balancePositive: '#22c55e',
  balanceNegative: '#ef4444',
}
