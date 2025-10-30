import type { GraphConfig } from '../config/config'
import type { NodeTypeToken } from '../model/graph'
import type { GraphLink } from '../model/link'
import type { GraphNode } from '../model/node'

export function terminateEvent(event: Event): void {
  event.preventDefault()
  event.stopPropagation()
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export function getNodeRadius<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(config: GraphConfig<T, Node, Link>, node: Node): number {
  return isNumber(config.nodeRadius)
    ? config.nodeRadius
    : config.nodeRadius(node)
}

/**
 * Get the id of a link.
 * @param link - The link.
 */
export function getLinkId<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(link: Link): string {
  return `${link.source.id}-${link.target.id}`
}

/**
 * Get the ID of a marker.
 * @param color - The color of the link.
 */
export function getMarkerId(color: string): string {
  return `link-arrow-${color}`.replace(/[()]/g, '~')
}

/**
 * Get the URL of a marker.
 * @param link - The link of the marker.
 */
export function getMarkerUrl<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(link: Link): string {
  return `url(#${getMarkerId(link.color)})`
}
