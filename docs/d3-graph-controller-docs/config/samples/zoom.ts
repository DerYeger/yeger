import { defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  zoom: {
    initial: 1,
    max: 2,
    min: 0.1,
  },
})
