import type { GraphConfig } from '../config/config'
import type { Graph, NodeTypeToken } from '../model/graph'
import type { GraphLink } from '../model/link'
import type { GraphNode } from '../model/node'
import type { Canvas, MarkerSelection } from './types'
import { getMarkerId } from './utils'

export function defineMarkerSelection(canvas: Canvas): MarkerSelection {
  return canvas.append('defs').selectAll('marker')
}

export interface CreateMarkerParams<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> {
  readonly config: GraphConfig<T, Node, Link>
  readonly graph: Graph<T, Node, Link>
  readonly selection?: MarkerSelection | undefined
}

export function createMarkers<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>({ config, graph, selection }: CreateMarkerParams<T, Node, Link>): MarkerSelection | undefined {
  return selection
    ?.data(getUniqueColors(graph), (d) => d)
    .join((enter) => {
      const marker = enter
        .append('marker')
        .attr('id', (d) => getMarkerId(d))
        .attr('markerHeight', 4 * config.marker.size)
        .attr('markerWidth', 4 * config.marker.size)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('orient', 'auto')
        .attr('refX', config.marker.ref[0])
        .attr('refY', config.marker.ref[1])
        .attr('viewBox', config.marker.viewBox)
        .style('fill', (d) => d)
      marker.append('path').attr('d', makeLine(config.marker.path))
      return marker
    })
}

function getUniqueColors<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(graph: Graph<T, Node, Link>): string[] {
  return [...new Set(graph.links.map((link) => link.color))]
}

function makeLine(points: [number, number][]): string {
  const [start, ...rest] = points
  if (!start) {
    return 'M0,0'
  }
  const [startX, startY] = start
  return rest.reduce((line, [x, y]) => `${line}L${x},${y}`, `M${startX},${startY}`)
}
