import type { GraphConfig } from '~/config/config'
import type { Canvas, Drag, NodeSelection } from '~/lib/types'
import { getNodeRadius, terminateEvent } from '~/lib/utils'
import type { Graph, NodeTypeToken } from '~/model/graph'
import type { GraphLink } from '~/model/link'
import type { GraphNode } from '~/model/node'

export function defineNodeSelection<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
>(canvas: Canvas): NodeSelection<T, Node> {
  return canvas.append('g').classed('nodes', true).selectAll('circle')
}

export interface CreateNodesParams<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
> {
  readonly config: GraphConfig<T, Node, Link>
  readonly drag?: Drag<T, Node> | undefined
  readonly graph: Graph<T, Node, Link>
  readonly onNodeSelected: ((node: Node) => void) | undefined
  readonly onNodeContext: (node: Node) => void
  readonly selection?: NodeSelection<T, Node> | undefined
  readonly showLabels: boolean
}

export function createNodes<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
  Link extends GraphLink<T, Node>,
>({
  config,
  drag,
  graph,
  onNodeContext,
  onNodeSelected,
  selection,
  showLabels,
}: CreateNodesParams<T, Node, Link>): NodeSelection<T, Node> | undefined {
  const result = selection
    ?.data(graph.nodes, (d) => d.id)
    .join((enter) => {
      const nodeGroup = enter.append('g')

      if (drag !== undefined) {
        nodeGroup.call(drag)
      }

      const nodeCircle = nodeGroup
        .append('circle')
        .classed('node', true)
        .attr('r', (d) => getNodeRadius(config, d))
        .on('contextmenu', (event, d) => {
          terminateEvent(event)
          onNodeContext(d)
        })
        .on('pointerdown', (event: PointerEvent, d) =>
          onPointerDown(event, d, onNodeSelected ?? onNodeContext),
        )
        .style('fill', (d) => d.color)

      config.modifiers.node?.(nodeCircle)

      const nodeLabel = nodeGroup
        .append('text')
        .classed('node__label', true)
        .attr('dy', `0.33em`)
        .style('fill', (d) => (d.label ? d.label.color : null))
        .style('font-size', (d) => (d.label ? d.label.fontSize : null))
        .style('stroke', 'none')
        .text((d) => (d.label ? d.label.text : null))

      config.modifiers.nodeLabel?.(nodeLabel)

      return nodeGroup
    })

  result?.select('.node').classed('focused', (d) => d.isFocused)
  result?.select('.node__label').attr('opacity', showLabels ? 1 : 0)

  return result
}

const DOUBLE_CLICK_INTERVAL_MS = 500

function onPointerDown<T extends NodeTypeToken, Node extends GraphNode<T>>(
  event: PointerEvent,
  node: Node,
  onNodeSelected: (node: Node) => void,
): void {
  if (event.button !== undefined && event.button !== 0) {
    return
  }

  const lastInteractionTimestamp = node.lastInteractionTimestamp
  const now = Date.now()
  if (
    lastInteractionTimestamp === undefined ||
    now - lastInteractionTimestamp > DOUBLE_CLICK_INTERVAL_MS
  ) {
    node.lastInteractionTimestamp = now
    return
  }
  node.lastInteractionTimestamp = undefined
  onNodeSelected(node)
}

export function updateNodes<T extends NodeTypeToken, Node extends GraphNode<T>>(
  selection?: NodeSelection<T, Node>,
): void {
  selection?.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
}
