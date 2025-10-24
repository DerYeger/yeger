import type { AlphaConfig } from './alpha'
import type { SimulationForceConfig } from './forces'
import type { NodeTypeToken } from '../model/graph'
import type { GraphLink } from '../model/link'
import type { GraphNode } from '../model/node'

export interface SimulationConfig<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> {
  /**
   * Alpha value configuration.
   */
  readonly alphas: AlphaConfig<T, Node>
  /**
   * Force configuration.
   */
  readonly forces: SimulationForceConfig<T, Node, Link>
}
