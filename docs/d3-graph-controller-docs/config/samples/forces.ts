import { GraphLink, defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  simulation: {
    forces: {
      centering: {
        enabled: true,
        strength: 0.1,
      },
      charge: {
        enabled: true,
        strength: -1,
      },
      collision: {
        enabled: true,
        strength: 1,
        radiusMultiplier: 2,
      },
      link: {
        enabled: true,
        length: (link: GraphLink) => 128,
        strength: 1,
      },
    },
  },
})
