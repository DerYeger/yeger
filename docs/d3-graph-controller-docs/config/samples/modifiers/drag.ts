import { Drag, GraphNode, defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  modifiers: {
    drag: (drag: Drag<string, GraphNode>) => {
      // Customize drag behavior
    },
  },
})
