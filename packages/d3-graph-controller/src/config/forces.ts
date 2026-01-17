import type { NodeTypeToken } from '../model/graph'
import type { GraphLink } from '../model/link'
import type { GraphNode } from '../model/node'

/**
 * Simulation force.
 */
export interface Force<Subject> {
  /**
   * Whether the force is enabled.
   */
  readonly enabled: boolean
  /**
   * The strength of the force.
   * Can be a static number or a function receiving the force's subject and returning a number.
   */
  readonly strength: number | ((subject: Subject) => number)
}

/**
 * Simulation force applied to nodes.
 */
export type NodeForce<T extends NodeTypeToken, Node extends GraphNode<T>> = Force<Node>

/**
 * Collision force applied to nodes.
 */
export interface CollisionForce<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
> extends NodeForce<T, Node> {
  /**
   * Multiplier of the node radius.
   * Tip: Large values can drastically reduce link intersection.
   */
  readonly radiusMultiplier: number
}

/**
 * Simulation force applied to links.
 */
export interface LinkForce<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> extends Force<Link> {
  /**
   * Define the length of a link for the simulation.
   */
  readonly length: number | ((link: Link) => number)
}

/**
 * Simulation force configuration.
 */
export interface SimulationForceConfig<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> {
  /**
   * Centering force applied to nodes.
   */
  readonly centering: false | NodeForce<T, Node>
  /**
   * Charge force applied to nodes.
   */
  readonly charge: false | NodeForce<T, Node>
  /**
   * Collision force applied to nodes.
   */
  readonly collision: false | CollisionForce<T, Node>
  /**
   * Link force applied to links.
   */
  readonly link: false | LinkForce<T, Node, Link>
}

/**
 * Create the default force configuration.
 */
export function createDefaultForceConfig<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(): SimulationForceConfig<T, Node, Link> {
  return {
    centering: {
      enabled: true,
      strength: 0.1,
    },
    charge: {
      enabled: true,
      strength: -1,
    },
    collision: {
      enabled: true,
      strength: 1,
      radiusMultiplier: 2,
    },
    link: {
      enabled: true,
      strength: 1,
      length: 128,
    },
  }
}
