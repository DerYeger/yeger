import { GraphNode, defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  simulation: {
    alphas: {
      drag: {
        end: 0,
        start: 0.1,
      },
      filter: {
        link: 1,
        type: 0.1,
        unlinked: {
          include: 0.1,
          exclude: 0.1,
        },
      },
      focus: {
        acquire: (node: GraphNode) => 0.1,
        release: (node: GraphNode) => 0.1,
      },
      initialize: 1,
      labels: {
        links: {
          hide: 0,
          show: 0,
        },
        nodes: {
          hide: 0,
          show: 0,
        },
      },
      resize: 0.5,
    },
  },
})
