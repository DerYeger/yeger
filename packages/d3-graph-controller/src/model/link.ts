import type { SimulationLinkDatum } from 'd3-force'

import type { NodeTypeToken } from './graph'
import type { GraphNode } from './node'
import type { Label } from './shared'

/**
 * Link defining an edge from one node to another.
 */
export interface GraphLink<
  T extends NodeTypeToken = NodeTypeToken,
  SourceNode extends GraphNode<T> = GraphNode<T>,
  TargetNode extends GraphNode<T> = SourceNode,
> extends SimulationLinkDatum<SourceNode | TargetNode> {
  /**
   * The source node of the link.
   */
  readonly source: SourceNode
  /**
   * The target node of the link
   */
  readonly target: TargetNode
  /**
   * The color of the link.
   * Can be any valid CSS expression.
   */
  readonly color: string
  /**
   * The label of the node.
   * Using false will disable the node's label.
   */
  readonly label: false | Label
}

/**
 * Define a link with type inference.
 * @param data - The data of the link.
 */
export function defineLink<
  T extends NodeTypeToken = NodeTypeToken,
  SourceNode extends GraphNode<T> = GraphNode<T>,
  TargetNode extends GraphNode<T> = SourceNode,
  Link extends GraphLink<T, SourceNode, TargetNode> = GraphLink<T, SourceNode, TargetNode>,
>(data: Link): Link {
  return {
    ...data,
  }
}
