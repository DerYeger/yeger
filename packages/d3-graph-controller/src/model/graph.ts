import type { GraphLink } from '~/model/link'
import type { GraphNode } from '~/model/node'

/**
 * Type token for nodes.
 */
export type NodeTypeToken = string

/**
 * Graph containing nodes and links.
 */
export interface Graph<
  T extends NodeTypeToken = NodeTypeToken,
  Node extends GraphNode<T> = GraphNode<T>,
  Link extends GraphLink<T, Node> = GraphLink<T, Node>,
> {
  /**
   * The nodes of the graph.
   */
  readonly nodes: Node[]
  /**
   * The links of the graph.
   */
  readonly links: Link[]
}

/**
 * Define a graph with type inference.
 * @param data - The nodes and links of the graph. If either are omitted, they default to an empty array.
 */
export function defineGraph<
  T extends NodeTypeToken = NodeTypeToken,
  Node extends GraphNode<T> = GraphNode<T>,
  Link extends GraphLink<T, Node> = GraphLink<T, Node>,
>({ nodes, links }: Partial<Graph<T, Node, Link>>): Graph<T, Node, Link> {
  return {
    nodes: nodes ?? ([] as Node[]),
    links: links ?? ([] as Link[]),
  }
}
