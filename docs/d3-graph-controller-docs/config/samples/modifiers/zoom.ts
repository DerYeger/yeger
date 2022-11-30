import { Zoom, defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  modifiers: {
    zoom: (zoom: Zoom) => {
      // Customize zoom
    },
  },
})
