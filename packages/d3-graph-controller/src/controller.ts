import { debounce } from '@yeger/debounce'
import { select } from 'd3-selection'
import type { D3ZoomEvent } from 'd3-zoom'
import { Vector } from 'vecti'

import type { GraphConfig } from '~/config/config'
import type { LinkFilter } from '~/config/filter'
import { defineCanvas, updateCanvasTransform } from '~/lib/canvas'
import { defineDrag } from '~/lib/drag'
import { filterGraph } from '~/lib/filter'
import { createLinks, defineLinkSelection, updateLinks } from '~/lib/link'
import { createMarkers, defineMarkerSelection } from '~/lib/marker'
import { createNodes, defineNodeSelection, updateNodes } from '~/lib/node'
import { defineSimulation } from '~/lib/simulation'
import type {
  Canvas,
  Drag,
  GraphSimulation,
  LinkSelection,
  MarkerSelection,
  NodeSelection,
  Zoom,
} from '~/lib/types'
import { isNumber } from '~/lib/utils'
import { defineZoom } from '~/lib/zoom'
import type { Graph, NodeTypeToken } from '~/model/graph'
import type { GraphLink } from '~/model/link'
import type { GraphNode } from '~/model/node'

/**
 * Controller for a graph view.
 */
export class GraphController<
  T extends NodeTypeToken = NodeTypeToken,
  Node extends GraphNode<T> = GraphNode<T>,
  Link extends GraphLink<T, Node> = GraphLink<T, Node>,
> {
  /**
   * Array of all node types included in the controller's graph.
   */
  public readonly nodeTypes: T[]
  private _nodeTypeFilter: T[]
  private _includeUnlinked = true

  private _linkFilter: LinkFilter<T, Node, Link> = () => true

  private _showLinkLabels = true
  private _showNodeLabels = true

  private filteredGraph!: Graph<T, Node, Link>

  private width = 0
  private height = 0

  private simulation: GraphSimulation<T, Node, Link> | undefined

  private canvas: Canvas | undefined
  private linkSelection: LinkSelection<T, Node, Link> | undefined
  private nodeSelection: NodeSelection<T, Node> | undefined
  private markerSelection: MarkerSelection | undefined

  private zoom: Zoom | undefined
  private drag: Drag<T, Node> | undefined

  private xOffset = 0
  private yOffset = 0
  private scale: number

  private focusedNode: Node | undefined = undefined

  private resizeObserver?: ResizeObserver

  /**
   * Create a new controller and initialize the view.
   * @param container - The container the graph will be placed in.
   * @param graph - The graph of the controller.
   * @param config - The config of the controller.
   */
  public constructor(
    private readonly container: HTMLDivElement,
    private readonly graph: Graph<T, Node, Link>,
    private readonly config: GraphConfig<T, Node, Link>,
  ) {
    this.scale = config.zoom.initial

    this.resetView()

    this.graph.nodes.forEach((node) => {
      const [x, y] = config.positionInitializer(
        node,
        this.effectiveWidth,
        this.effectiveHeight,
      )
      node.x = node.x ?? x
      node.y = node.y ?? y
    })

    this.nodeTypes = [...new Set(graph.nodes.map((d) => d.type))]
    this._nodeTypeFilter = [...this.nodeTypes]

    if (config.initial) {
      const {
        includeUnlinked,
        nodeTypeFilter,
        linkFilter,
        showLinkLabels,
        showNodeLabels,
      } = config.initial
      this._includeUnlinked = includeUnlinked ?? this._includeUnlinked
      this._showLinkLabels = showLinkLabels ?? this._showLinkLabels
      this._showNodeLabels = showNodeLabels ?? this._showNodeLabels
      this._nodeTypeFilter = nodeTypeFilter ?? this._nodeTypeFilter
      this._linkFilter = linkFilter ?? this._linkFilter
    }

    this.filterGraph(undefined)
    this.initGraph()
    this.restart(config.simulation.alphas.initialize)

    if (config.autoResize) {
      this.resizeObserver = new ResizeObserver(debounce(() => this.resize()))
      this.resizeObserver.observe(this.container)
    }
  }

  /**
   * Get the current node type filter.
   * Only nodes whose type is included will be shown.
   */
  public get nodeTypeFilter(): T[] {
    return this._nodeTypeFilter
  }

  /**
   * Get whether nodes without incoming or outgoing links will be shown or not.
   */
  public get includeUnlinked(): boolean {
    return this._includeUnlinked
  }

  /**
   * Set whether nodes without incoming or outgoing links will be shown or not.
   * @param value - The value.
   */
  public set includeUnlinked(value: boolean) {
    this._includeUnlinked = value
    this.filterGraph(this.focusedNode)
    const { include, exclude } = this.config.simulation.alphas.filter.unlinked
    const alpha = value ? include : exclude
    this.restart(alpha)
  }

  /**
   * Set a new link filter and update the controller's state.
   * @param value - The new link filter.
   */
  public set linkFilter(value: LinkFilter<T, Node, Link>) {
    this._linkFilter = value
    this.filterGraph(this.focusedNode)
    this.restart(this.config.simulation.alphas.filter.link)
  }

  /**
   * Get the current link filter.
   * @returns - The current link filter.
   */
  public get linkFilter(): LinkFilter<T, Node, Link> {
    return this._linkFilter
  }

  /**
   * Get whether node labels are shown or not.
   */
  public get showNodeLabels(): boolean {
    return this._showNodeLabels
  }

  /**
   * Set whether node labels will be shown or not.
   * @param value - The value.
   */
  public set showNodeLabels(value: boolean) {
    this._showNodeLabels = value
    const { hide, show } = this.config.simulation.alphas.labels.nodes
    const alpha = value ? show : hide
    this.restart(alpha)
  }

  /**
   * Get whether link labels are shown or not.
   */
  public get showLinkLabels(): boolean {
    return this._showLinkLabels
  }

  /**
   * Set whether link labels will be shown or not.
   * @param value - The value.
   */
  public set showLinkLabels(value: boolean) {
    this._showLinkLabels = value
    const { hide, show } = this.config.simulation.alphas.labels.links
    const alpha = value ? show : hide
    this.restart(alpha)
  }

  private get effectiveWidth(): number {
    return this.width / this.scale
  }

  private get effectiveHeight(): number {
    return this.height / this.scale
  }

  private get effectiveCenter(): Vector {
    return Vector.of([this.width, this.height])
      .divide(2)
      .subtract(Vector.of([this.xOffset, this.yOffset]))
      .divide(this.scale)
  }

  /**
   * Resize the graph to fit its container.
   */
  public resize(): void {
    const oldWidth = this.width
    const oldHeight = this.height
    const newWidth = this.container.getBoundingClientRect().width
    const newHeight = this.container.getBoundingClientRect().height
    const widthDiffers = oldWidth.toFixed() !== newWidth.toFixed()
    const heightDiffers = oldHeight.toFixed() !== newHeight.toFixed()

    if (!widthDiffers && !heightDiffers) {
      return
    }

    this.width = this.container.getBoundingClientRect().width
    this.height = this.container.getBoundingClientRect().height

    const alpha = this.config.simulation.alphas.resize

    this.restart(
      isNumber(alpha)
        ? alpha
        : alpha({ oldWidth, oldHeight, newWidth, newHeight }),
    )
  }

  /**
   * Restart the controller.
   * @param alpha - The alpha value of the controller's simulation after the restart.
   */
  public restart(alpha: number): void {
    this.markerSelection = createMarkers({
      config: this.config,
      graph: this.filteredGraph,
      selection: this.markerSelection,
    })

    this.linkSelection = createLinks({
      config: this.config,
      graph: this.filteredGraph,
      selection: this.linkSelection,
      showLabels: this._showLinkLabels,
    })

    this.nodeSelection = createNodes({
      config: this.config,
      drag: this.drag,
      graph: this.filteredGraph,
      onNodeContext: (d) => this.toggleNodeFocus(d),
      onNodeSelected: this.config.callbacks.nodeClicked,
      selection: this.nodeSelection,
      showLabels: this._showNodeLabels,
    })

    this.simulation?.stop()
    this.simulation = defineSimulation({
      center: () => this.effectiveCenter,
      config: this.config,
      graph: this.filteredGraph,
      onTick: () => this.onTick(),
    })
      .alpha(alpha)
      .restart()
  }

  /**
   * Update the node type filter by either including or removing the specified type from the filter.
   * @param include - Whether the type will be included or removed from the filter.
   * @param nodeType - The type to be added or removed from the filter.
   */
  public filterNodesByType(include: boolean, nodeType: T) {
    if (include) {
      this._nodeTypeFilter.push(nodeType)
    } else {
      this._nodeTypeFilter = this._nodeTypeFilter.filter(
        (type) => type !== nodeType,
      )
    }
    this.filterGraph(this.focusedNode)
    this.restart(this.config.simulation.alphas.filter.type)
  }

  /**
   * Shut down the controller's simulation and (optional) automatic resizing.
   */
  public shutdown(): void {
    if (this.focusedNode !== undefined) {
      this.focusedNode.isFocused = false
      this.focusedNode = undefined
    }
    this.resizeObserver?.unobserve(this.container)
    this.simulation?.stop()
  }

  private initGraph(): void {
    this.zoom = defineZoom({
      config: this.config,
      canvasContainer: () => select(this.container).select('svg'),
      min: this.config.zoom.min,
      max: this.config.zoom.max,
      onZoom: (event) => this.onZoom(event),
    })
    this.canvas = defineCanvas({
      applyZoom: this.scale !== 1,
      container: select(this.container),
      offset: [this.xOffset, this.yOffset],
      scale: this.scale,
      zoom: this.zoom,
    })
    this.applyZoom()
    this.linkSelection = defineLinkSelection(this.canvas)
    this.nodeSelection = defineNodeSelection(this.canvas)
    this.markerSelection = defineMarkerSelection(this.canvas)
    this.drag = defineDrag({
      config: this.config,
      onDragStart: () =>
        this.simulation
          ?.alphaTarget(this.config.simulation.alphas.drag.start)
          .restart(),
      onDragEnd: () =>
        this.simulation
          ?.alphaTarget(this.config.simulation.alphas.drag.end)
          .restart(),
    })
  }

  private onTick(): void {
    updateNodes(this.nodeSelection)

    updateLinks({
      config: this.config,
      center: this.effectiveCenter,
      graph: this.filteredGraph,
      selection: this.linkSelection,
    })
  }

  private resetView(): void {
    this.simulation?.stop()
    select(this.container).selectChildren().remove()
    this.zoom = undefined
    this.canvas = undefined
    this.linkSelection = undefined
    this.nodeSelection = undefined
    this.markerSelection = undefined
    this.simulation = undefined
    this.width = this.container.getBoundingClientRect().width
    this.height = this.container.getBoundingClientRect().height
  }

  private onZoom(event: D3ZoomEvent<SVGSVGElement, undefined>): void {
    this.xOffset = event.transform.x
    this.yOffset = event.transform.y
    this.scale = event.transform.k
    this.applyZoom()
    this.config.hooks.afterZoom?.(this.scale, this.xOffset, this.yOffset)
    this.simulation?.restart()
  }

  private applyZoom() {
    updateCanvasTransform({
      canvas: this.canvas,
      scale: this.scale,
      xOffset: this.xOffset,
      yOffset: this.yOffset,
    })
  }

  private toggleNodeFocus(node: Node): void {
    if (node.isFocused) {
      this.filterGraph(undefined)
      this.restart(this.config.simulation.alphas.focus.release(node))
    } else {
      this.focusNode(node)
    }
  }

  private focusNode(node: Node): void {
    this.filterGraph(node)
    this.restart(this.config.simulation.alphas.focus.acquire(node))
  }

  private filterGraph(nodeToFocus?: Node): void {
    if (this.focusedNode !== undefined) {
      this.focusedNode.isFocused = false
      this.focusedNode = undefined
    }

    if (
      nodeToFocus !== undefined &&
      this._nodeTypeFilter.includes(nodeToFocus.type)
    ) {
      nodeToFocus.isFocused = true
      this.focusedNode = nodeToFocus
    }

    this.filteredGraph = filterGraph({
      graph: this.graph,
      filter: this._nodeTypeFilter,
      focusedNode: this.focusedNode,
      includeUnlinked: this._includeUnlinked,
      linkFilter: this._linkFilter,
    })
  }
}
