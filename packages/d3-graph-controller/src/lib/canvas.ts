import { zoomIdentity } from 'd3-zoom'

import type { Canvas, GraphHost, Zoom } from '~/lib/types'
import { terminateEvent } from '~/lib/utils'

export interface DefineCanvasParams {
  readonly applyZoom: boolean
  readonly container: GraphHost
  readonly offset: [number, number]
  readonly onDoubleClick?: (event: PointerEvent) => void
  readonly onPointerMoved?: (event: PointerEvent) => void
  readonly onPointerUp?: (event: PointerEvent) => void
  readonly scale: number
  readonly zoom: Zoom
}

export function defineCanvas({
  applyZoom,
  container,
  onDoubleClick,
  onPointerMoved,
  onPointerUp,
  offset: [xOffset, yOffset],
  scale,
  zoom,
}: DefineCanvasParams): Canvas {
  const svg = container
    .classed('graph', true)
    .append('svg')
    .attr('height', '100%')
    .attr('width', '100%')
    .call(zoom)
    .on('contextmenu', (event: MouseEvent) => terminateEvent(event))
    .on('dblclick', (event: PointerEvent) => onDoubleClick?.(event))
    .on('dblclick.zoom', null)
    .on('pointermove', (event: PointerEvent) => onPointerMoved?.(event))
    .on('pointerup', (event: PointerEvent) => onPointerUp?.(event))
    .style('cursor', 'grab')

  if (applyZoom) {
    svg.call(
      zoom.transform,
      zoomIdentity.translate(xOffset, yOffset).scale(scale),
    )
  }

  return svg.append('g')
}

export interface UpdateCanvasParams {
  readonly canvas?: Canvas | undefined
  readonly scale: number
  readonly xOffset: number
  readonly yOffset: number
}

export function updateCanvasTransform({
  canvas,
  scale,
  xOffset,
  yOffset,
}: UpdateCanvasParams): void {
  canvas?.attr('transform', `translate(${xOffset},${yOffset})scale(${scale})`)
}
