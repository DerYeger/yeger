<script setup lang="ts">
import type { Model } from '@yeger/fol'
import type {
  GraphNode,
  NodeModifier,
  PositionInitializer,
  ResizeContext,
} from 'd3-graph-controller'
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

watch(graph, (_, oldGraph) => {
  resetGraphController(PositionInitializers.Stable(oldGraph))
})

function resetGraphController(
  positionInitializer?: PositionInitializer<string, GraphNode<string>>
) {
  controller.value?.shutdown()
  if (!graph.value || !el.value) {
    return
  }
  const defaultPositionInitializer =
    graph.value.nodes.length > 1
      ? PositionInitializers.Randomized
      : PositionInitializers.Centered
  const nodeModifier: NodeModifier<string, GraphNode> = (selection) => {
    selection.on('pointerdown', null)
    selection.on('pointerup', null)
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
      modifiers: {
        node: nodeModifier,
      },
      marker: Markers.Arrow(2),
      positionInitializer: positionInitializer ?? defaultPositionInitializer,
      zoom: {
        min: 0.25,
        initial: 0.8,
        max: 2,
      },
    })
  )
}
</script>

<template>
  <div class="h-full w-full relative">
    <div ref="el" />
    <button
      class="absolute top-2 right-2 flex items-start px-1"
      @click="controller?.restart(0.5)"
    >
      <Icon name="system-uicons:reset" class="block" />
    </button>
  </div>
</template>

<style>
.graph .node {
  stroke-width: 2px;
  stroke-opacity: 0.5;
}

.graph .node:hover:not(.focused) {
  filter: none !important;
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
