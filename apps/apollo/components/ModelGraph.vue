<script setup lang="ts">
import type { Model } from '@yeger/fol'
import type { ResizeContext } from 'd3-graph-controller'
import {
  GraphController,
  Markers,
  PositionInitializers,
  defineGraphConfig,
} from 'd3-graph-controller'

import { modelToGraph } from '~~/util/modelToGraph'

const props = defineProps<{
  model: Model
}>()

const { model } = toRefs(props)

const graph = computed(() => modelToGraph(model.value))

const el = ref<HTMLDivElement>()

const controller = ref<GraphController | undefined>()

onMounted(() => {
  resetGraphController()
})

onUnmounted(() => {
  controller.value?.shutdown()
})

function resetGraphController() {
  controller.value?.shutdown()
  if (!graph.value || !el.value) {
    return
  }
  controller.value = new GraphController(
    el.value!,
    graph.value,
    // See https://graph-controller.yeger.eu/config/ for more options
    defineGraphConfig({
      nodeRadius: 10,
      autoResize: true,
      simulation: {
        alphas: {
          initialize: 1,
          resize: ({ newHeight, newWidth }: ResizeContext) => {
            const willBeHidden = newHeight === 0 && newWidth === 0
            if (willBeHidden) {
              return 0
            }
            return 0.25
          },
        },
        forces: {
          collision: {
            radiusMultiplier: 10,
          },
          link: {
            length: 240,
          },
        },
      },
      marker: Markers.Arrow(2),
      positionInitializer:
        graph.value.nodes.length > 1
          ? PositionInitializers.Randomized
          : PositionInitializers.Centered,
      zoom: {
        min: 0.5,
        max: 2,
      },
    })
  )
}
</script>

<template>
  <div class="h-full w-full">
    <div ref="el" />
  </div>
</template>

<style>
.graph .node {
  stroke-width: 2px;
  stroke-opacity: 0.5;
}

.graph .link {
  stroke-width: 2px;
}

.graph .node__label,
.graph .link__label {
  font-weight: 100;
}

.graph .node__label {
  transform: translateY(20px);
}
</style>
