import type { GraphConfig } from './config'
import { getNodeRadius } from '../lib/utils'
import type { NodeTypeToken } from '../model/graph'
import type { GraphLink } from '../model/link'
import type { GraphNode } from '../model/node'

/**
 * Marker configuration.
 */
export interface MarkerConfig {
  /**
   * Size of the marker's box.
   */
  readonly size: number
  /**
   * Get padding of the marker for calculating link paths.
   * @param node - The node the marker is pointing at.
   * @param config - The current config.
   * @returns The padding of the marker.
   */
  readonly padding: <
    T extends NodeTypeToken,
    Node extends GraphNode<T>,
    Link extends GraphLink<T, Node>,
  >(
    node: Node,
    config: GraphConfig<T, Node, Link>,
  ) => number
  /**
   * The ref of the marker.
   */
  readonly ref: [number, number]
  /**
   * The path of the marker.
   */
  readonly path: [number, number][]
  /**
   * The ViewBox of the marker.
   */
  readonly viewBox: string
}

function defaultMarkerConfig(size: number): MarkerConfig {
  return {
    size,
    padding: <
      T extends NodeTypeToken,
      Node extends GraphNode<T>,
      Link extends GraphLink<T, Node>,
    >(
      node: Node,
      config: GraphConfig<T, Node, Link>,
    ) => getNodeRadius(config, node) + 2 * size,
    ref: [size / 2, size / 2],
    path: [
      [0, 0],
      [0, size],
      [size, size / 2],
    ] as [number, number][],
    viewBox: [0, 0, size, size].join(','),
  }
}

/**
 * Collection of built-in markers.
 */
export const Markers = {
  /**
   * Create an arrow marker configuration.
   * @param size - The size of the arrow
   */
  Arrow: (size: number): MarkerConfig => defaultMarkerConfig(size),
}
