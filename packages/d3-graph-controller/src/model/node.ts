import type { SimulationNodeDatum } from 'd3-force'

import type { NodeTypeToken } from './graph'
import type { Label } from './shared'

/**
 * Node representing a datum of a graph.
 */
export interface GraphNode<T extends NodeTypeToken = NodeTypeToken>
  extends SimulationNodeDatum {
  /**
   * The type of the node.
   */
  readonly type: T
  /**
   * The ID of the node.
   */
  readonly id: string
  /**
   * The color of the node.
   * Can be any valid CSS expression.
   */
  readonly color: string
  /**
   * The label of the node.
   * Using false will disable the node's label.
   */
  readonly label: false | Label
  /**
   * The focus state of a node.
   * Warning: Used for internal logic. Should not be set manually!
   */
  isFocused: boolean
  /**
   * The x-coordinate of a node.
   */
  x?: number | undefined
  /**
   * The y-coordinate of a node.
   */
  y?: number | undefined
  /**
   * The fixed x-coordinate of a node.
   * If set, the node will not be simulated.
   */
  fx?: number | undefined
  /**
   * The fixed y-coordinate of a node.
   * If set, the node will not be simulated.
   */
  fy?: number | undefined
  /**
   * Timestamp of the node's last interaction.
   * Warning: Used for internal logic. Should not be set manually!
   */
  lastInteractionTimestamp?: number | undefined
}

/**
 * Define a node with type inference.
 * @param data - The data of the node.
 */
export function defineNode<
  T extends NodeTypeToken = NodeTypeToken,
  Node extends GraphNode<T> = GraphNode<T>,
>(data: Node): Node {
  return {
    ...data,
    isFocused: false,
    lastInteractionTimestamp: undefined,
  }
}

const nodeDefaults: Omit<GraphNode, 'id' | 'type'> = {
  color: 'lightgray',
  label: {
    color: 'black',
    fontSize: '1rem',
    text: '',
  },
  isFocused: false,
}

/**
 * Define a node with type inference and some default values.
 * @param data - The data of the node.
 */
export function defineNodeWithDefaults<T extends NodeTypeToken = NodeTypeToken>(
  data: Partial<GraphNode<T>> & Pick<GraphNode, 'id' | 'type'>,
): GraphNode<T> {
  return defineNode<T>({
    ...nodeDefaults,
    ...data,
  })
}
