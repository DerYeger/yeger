import type { Selection } from 'd3-selection'

import type { Drag, GraphSimulation, Zoom } from '../lib/types'
import type { NodeTypeToken } from '../model/graph'
import type { GraphLink } from '../model/link'
import type { GraphNode } from '../model/node'

/**
 * Modifier for the drag.
 */
export type DragModifier<T extends NodeTypeToken, Node extends GraphNode<T>> = (
  drag: Drag<T, Node>,
) => void

/**
 * Modifier for node circles.
 */
export type NodeModifier<T extends NodeTypeToken, Node extends GraphNode<T>> = (
  selection: Selection<SVGCircleElement, Node, SVGGElement, undefined>,
) => void

/**
 * Modifier for node labels.
 */
export type NodeLabelModifier<T extends NodeTypeToken, Node extends GraphNode<T>> = (
  selection: Selection<SVGTextElement, Node, SVGGElement, undefined>,
) => void

/**
 * Modifier for link paths.
 */
export type LinkModifier<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> = (selection: Selection<SVGPathElement, Link, SVGGElement, undefined>) => void

/**
 * Modifier for link labels.
 */
export type LinkLabelModifier<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> = (selection: Selection<SVGTextElement, Link, SVGGElement, undefined>) => void

/**
 * Modifier for the simulation.
 */
export type SimulationModifier<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> = (simulation: GraphSimulation<T, Node, Link>) => void

/**
 * Modifier for the zoom.
 */
export type ZoomModifier = (zoom: Zoom) => void

/**
 * Low-level callbacks for modifying the underlying d3-selection.wd
 */
export interface Modifiers<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> {
  /**
   * Modify the drag.
   * @param drag - The drag.
   */
  readonly drag?: DragModifier<T, Node>
  /**
   * Modify the node selection.
   * @param selection - The selection of nodes.
   */
  readonly node?: NodeModifier<T, Node>
  /**
   * Modify the node label selection.
   * @param selection - The selection of node labels.
   */
  readonly nodeLabel?: NodeLabelModifier<T, Node>
  /**
   * Modify the link selection.
   * @param selection - The selection of links.
   */
  readonly link?: LinkModifier<T, Node, Link>
  /**
   * Modify the link label selection.
   * @param selection - The selection of link labels.
   */
  readonly linkLabel?: LinkLabelModifier<T, Node, Link>
  /**
   * Modify the simulation.
   * @param simulation - The simulation.
   */
  readonly simulation?: SimulationModifier<T, Node, Link>
  /**
   * Modify the zoom.
   * @param zoom - The zoom.
   */
  readonly zoom?: ZoomModifier
}
