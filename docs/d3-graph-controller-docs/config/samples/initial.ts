import { defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  initial: {
    includeUnlinked: true,
    linkFilter: () => true,
    nodeTypeFilter: undefined,
    showLinkLabels: true,
    showNodeLabels: true,
  },
})
