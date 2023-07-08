import {
  PositionInitializers,
  defineGraph,
  defineGraphConfig,
} from 'd3-graph-controller'

import type { DemoGraph, DemoGraphConfig } from './model'
import type { DemoNode } from './node'
import { defineDemoNode } from './node'

export const randomGraphConfig: DemoGraphConfig = defineGraphConfig({
  autoResize: true,
  nodeRadius: (node: DemoNode) => 4 * node.radiusMultiplier,
  initial: {
    showLinkLabels: false,
    showNodeLabels: false,
  },
  positionInitializer: PositionInitializers.Randomized,
  simulation: {
    forces: {
      charge: {
        strength: -50,
      },
    },
  },
})

export function generateRandomGraph(): DemoGraph {
  const nodeCount = 200
  const nodes: DemoNode[] = Array.from({ length: nodeCount }).map((_, id) =>
    defineDemoNode(
      id.toString(),
      id % 4 === 1 ? 'secondary' : 'primary',
      1 + Math.random() * (id % (3 * Math.random())),
    ),
  )
  // const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]))
  // const links: DemoLink[] = [...new Array(42)].map(() => {
  //   const source = nodeMap[randomNodeId(nodeCount)]
  //   const target = nodeMap[randomNodeId(nodeCount)]
  //   const weight = Math.random() * 3
  //   return defineDemoLink(source, target, weight)
  // })

  return defineGraph({
    nodes,
  })
}

// function randomNodeId(nodeCount: number): string {
//   return Math.floor(Math.random() * nodeCount).toString()
// }
