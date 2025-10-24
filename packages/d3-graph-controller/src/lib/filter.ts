import type { LinkFilter } from '../config/filter'
import type { Graph, NodeTypeToken } from '../model/graph'
import type { GraphLink } from '../model/link'
import type { GraphNode } from '../model/node'

export interface GraphFilterParams<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> {
  readonly graph: Graph<T, Node, Link>
  readonly filter: T[]
  readonly focusedNode?: Node | undefined
  readonly includeUnlinked: boolean
  readonly linkFilter: LinkFilter<T, Node, Link>
}

export function filterGraph<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>({
  graph,
  filter,
  focusedNode,
  includeUnlinked,
  linkFilter,
}: GraphFilterParams<T, Node, Link>): Graph<T, Node, Link> {
  const links = graph.links.filter(
    (d) =>
      filter.includes(d.source.type) &&
      filter.includes(d.target.type) &&
      linkFilter(d),
  )

  const isLinked = (node: Node) =>
    links.find(
      (link) => link.source.id === node.id || link.target.id === node.id,
    ) !== undefined
  const nodes = graph.nodes.filter(
    (d) => filter.includes(d.type) && (includeUnlinked || isLinked(d)),
  )

  if (focusedNode === undefined || !filter.includes(focusedNode.type)) {
    return {
      nodes,
      links,
    }
  }

  return getFocusedSubgraph({ nodes, links }, focusedNode)
}

function getFocusedSubgraph<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(graph: Graph<T, Node, Link>, source: Node): Graph<T, Node, Link> {
  const links = [
    ...getIncomingLinksTransitively(graph, source),
    ...getOutgoingLinksTransitively(graph, source),
  ]

  const nodes = links.flatMap((link) => [link.source, link.target])

  return {
    nodes: [...new Set([...nodes, source])],
    links: [...new Set(links)],
  }
}

function getIncomingLinksTransitively<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(graph: Graph<T, Node, Link>, source: Node): Link[] {
  return getLinksInDirectionTransitively(
    graph,
    source,
    (link, node) => link.target.id === node.id,
  )
}

function getOutgoingLinksTransitively<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(graph: Graph<T, Node, Link>, source: Node): Link[] {
  return getLinksInDirectionTransitively(
    graph,
    source,
    (link, node) => link.source.id === node.id,
  )
}

function getLinksInDirectionTransitively<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>(
  graph: Graph<T, Node, Link>,
  source: Node,
  directionPredicate: (link: Link, node: Node) => boolean,
): Link[] {
  const remainingLinks = new Set(graph.links)
  const foundNodes = new Set([source])
  const foundLinks: Link[] = []

  while (remainingLinks.size > 0) {
    const newLinks = [...remainingLinks].filter((link) =>
      [...foundNodes].some((node) => directionPredicate(link, node)),
    )

    if (newLinks.length === 0) {
      return foundLinks
    }

    newLinks.forEach((link) => {
      foundNodes.add(link.source)
      foundNodes.add(link.target)
      foundLinks.push(link)
      remainingLinks.delete(link)
    })
  }

  return foundLinks
}
