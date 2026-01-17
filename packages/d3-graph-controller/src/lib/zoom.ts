import type { Selection } from 'd3-selection'
import type { D3ZoomEvent } from 'd3-zoom'
import { zoom } from 'd3-zoom'

import type { GraphConfig } from '../config/config'
import type { Zoom } from './types'
import type { NodeTypeToken } from '../model/graph'
import type { GraphLink } from '../model/link'
import type { GraphNode } from '../model/node'

export interface DefineZoomParams<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> {
  readonly canvasContainer: () => Selection<SVGSVGElement, unknown, null, undefined>
  readonly config: GraphConfig<T, Node, Link>
  readonly min: number
  readonly max: number
  readonly onZoom: (event: D3ZoomEvent<SVGSVGElement, undefined>) => void
}

export function defineZoom<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>({ canvasContainer, config, min, max, onZoom }: DefineZoomParams<T, Node, Link>): Zoom {
  const z = zoom<SVGSVGElement, undefined>()
    .scaleExtent([min, max])
    .filter((event) => event.button === 0 || event.touches?.length >= 2)
    .on('start', () => canvasContainer().classed('grabbed', true))
    .on('zoom', (event) => onZoom(event))
    .on('end', () => canvasContainer().classed('grabbed', false))

  config.modifiers.zoom?.(z)

  return z
}
