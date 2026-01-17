import { GraphLink, defineGraphConfig } from 'd3-graph-controller'
import type { Selection } from 'd3-selection'

const config = defineGraphConfig({
  modifiers: {
    link: (selection: Selection<SVGPathElement, GraphLink, SVGGElement, undefined>) => {
      // Customize link paths
    },
    linkLabel: (selection: Selection<SVGTextElement, GraphLink, SVGGElement, undefined>) => {
      // Customize link labels
    },
  },
})
