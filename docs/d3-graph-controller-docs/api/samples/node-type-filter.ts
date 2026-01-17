import { GraphController, defineGraph, defineGraphConfig } from 'd3-graph-controller'

const container = document.getElementById('graph') as HTMLDivElement
const graph = defineGraph({
  /* ... */
})
const config = defineGraphConfig({
  /* ... */
})

// #region snippet
const controller = new GraphController(container, graph, config)

controller.filterNodesByType(true, 'nodeTypeToInclude')

controller.filterNodesByType(false, 'nodeTypeToExclude')
// #endregion snippet
