import { GraphNode, defineGraphConfig } from 'd3-graph-controller'
import type { Selection } from 'd3-selection'

const config = defineGraphConfig({
  modifiers: {
    node: (
      selection: Selection<SVGCircleElement, GraphNode, SVGGElement, undefined>,
    ) => {
      // Customize node circles
    },
    nodeLabel: (
      selection: Selection<SVGTextElement, GraphNode, SVGGElement, undefined>,
    ) => {
      // Customize node labels
    },
  },
})
