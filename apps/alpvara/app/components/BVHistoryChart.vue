<script setup lang="ts">
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { LegendComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([LegendComponent, LineChart, GridComponent, TooltipComponent, CanvasRenderer])

defineOptions({
  tags: ['linecharts', 'multiline'],
})

const { chartOptions } = useBVHistoryChart()
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
