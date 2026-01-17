import { GraphLink, GraphNode, GraphSimulation, defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  modifiers: {
    simulation: (simulation: GraphSimulation<string, GraphNode, GraphLink>) => {
      // Customize simulation
    },
  },
})
