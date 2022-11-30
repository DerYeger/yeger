import { GraphNode, defineGraphConfig } from 'd3-graph-controller'

type CustomNode = GraphNode & { radius: number }

const config = defineGraphConfig<string, CustomNode>({
  nodeRadius: (node: CustomNode) => node.radius,
})
