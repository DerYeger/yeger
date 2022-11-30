import type { NodeTypeToken } from '~/model/graph'
import type { GraphNode } from '~/model/node'

/**
 * Initializes a node's position in context of a graph's width and height.
 */
export type PositionInitializer<
  T extends NodeTypeToken,
  Node extends GraphNode<T>
> = (node: Node, width: number, height: number) => [number, number]

const Centered: PositionInitializer<NodeTypeToken, GraphNode> = (
  _,
  width,
  height
) => [width / 2, height / 2]

const Randomized: PositionInitializer<NodeTypeToken, GraphNode> = (
  _,
  width,
  height
) => [randomInRange(0, width), randomInRange(0, height)]

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Collection of built-in position initializers.
 */
export const PositionInitializers = {
  /**
   * Initializes node positions to a graph's center.
   */
  Centered,
  /**
   * Randomly initializes node positions within the visible area.
   */
  Randomized,
}
