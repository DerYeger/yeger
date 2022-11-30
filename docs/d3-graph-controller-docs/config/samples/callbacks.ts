import { GraphNode, defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  callbacks: {
    nodeClicked: (node: GraphNode) => console.log(node.id),
  },
})
