import type { NodeTypeToken } from '~/model/graph'
import type { GraphNode } from '~/model/node'

/**
 * Callback configuration.
 */
export interface Callbacks<T extends NodeTypeToken, Node extends GraphNode<T>> {
  /**
   * Callback when a node is double-clicked or double-tapped.
   * @param node - The node.
   */
  readonly nodeClicked?: (node: Node) => void
}
