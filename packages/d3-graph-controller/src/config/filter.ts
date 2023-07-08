import type { NodeTypeToken } from '~/model/graph'
import type { GraphLink } from '~/model/link'
import type { GraphNode } from '~/model/node'

/**
 * Link filter.
 * Receives a link and returns whether the link should be included or not.
 */
export type LinkFilter<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> = (link: Link) => boolean
