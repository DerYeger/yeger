import type { D3DragEvent, DragBehavior } from 'd3-drag'
import type { Simulation } from 'd3-force'
import type { Selection } from 'd3-selection'
import type { ZoomBehavior } from 'd3-zoom'

import type { NodeTypeToken } from '~/model/graph'
import type { GraphLink } from '~/model/link'
import type { GraphNode } from '~/model/node'

export type Canvas = Selection<SVGGElement, undefined, null, undefined>

export type Drag<
  T extends NodeTypeToken,
  Node extends GraphNode<T>
> = DragBehavior<SVGGElement, Node, Node>
export type NodeDragEvent<
  T extends NodeTypeToken,
  Node extends GraphNode<T>
> = D3DragEvent<SVGCircleElement, Node, Node>

export type GraphHost = Selection<HTMLDivElement, undefined, null, undefined>

export type GraphSimulation<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>
> = Simulation<Node, Link>

export type LinkSelection<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>
> = Selection<SVGGElement, Link, SVGGElement, undefined>

export type MarkerSelection = Selection<
  SVGMarkerElement,
  string,
  SVGGElement,
  undefined
>

export type NodeSelection<
  T extends NodeTypeToken,
  Node extends GraphNode<T>
> = Selection<SVGGElement, Node, SVGGElement, undefined>

export type Zoom = ZoomBehavior<SVGSVGElement, undefined>
