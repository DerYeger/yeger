// #region token
export type CustomType = 'primary' | 'secondary'
// #endregion token

// #region node
import { GraphNode } from 'd3-graph-controller'

export interface CustomNode extends GraphNode<CustomType> {
  radius: number
}
// #endregion node

// #region link
import { GraphLink } from 'd3-graph-controller'

export interface CustomLink extends GraphLink<CustomType, CustomNode> {
  length: number
}
// #endregion link

// #region config
import { defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig<CustomType, CustomNode, CustomLink>({
  nodeRadius: (node: CustomNode) => node.radius,
  simulation: {
    forces: {
      centering: {
        strength: (node: CustomNode) => (node.type === 'primary' ? 0.5 : 0.1),
      },
      link: {
        length: (link: CustomLink) => link.length,
      },
    },
  },
})
// #endregion config

// #region model
import { defineGraph, defineLink, defineNode } from 'd3-graph-controller'

const a = defineNode<CustomType, CustomNode>({
  id: 'a',
  type: 'primary',
  isFocused: false,
  color: 'green',
  label: {
    color: 'black',
    fontSize: '1rem',
    text: 'A',
  },
  radius: 64,
})

const b = defineNode<CustomType, CustomNode>({
  id: 'b',
  type: 'secondary',
  isFocused: false,
  color: 'blue',
  label: {
    color: 'black',
    fontSize: '1rem',
    text: 'B',
  },
  radius: 32,
})

const aToB = defineLink<CustomType, CustomNode, CustomNode, CustomLink>({
  source: a,
  target: b,
  color: 'red',
  label: {
    color: 'black',
    fontSize: '1rem',
    text: '128',
  },
  length: 128,
})

const graph = defineGraph<CustomType, CustomNode, CustomLink>({
  nodes: [a, b],
  links: [aToB],
})
// #endregion model

// #region controller
import { GraphController } from 'd3-graph-controller'

// Any HTMLDivElement can be used as the container
const container = document.getElementById('graph') as HTMLDivElement

const controller = new GraphController(container, graph, config)
// #endregion controller
