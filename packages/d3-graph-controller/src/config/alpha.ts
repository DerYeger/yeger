import type { NodeTypeToken } from '~/model/graph'
import type { GraphNode } from '~/model/node'

/**
 * Alpha values when label display changes.
 */
export interface LabelAlphas {
  /**
   * Alpha value when labels are turned off.
   */
  readonly hide: number
  /**
   * Alpha value when labels are turned on.
   */
  readonly show: number
}

/**
 * Context of a resize.
 */
export interface ResizeContext {
  /**
   * The old height.
   */
  readonly oldHeight: number
  /**
   * The old width.
   */
  readonly oldWidth: number
  /**
   * The new height.
   */
  readonly newHeight: number
  /**
   * The new width.
   */
  readonly newWidth: number
}

/**
 * Alpha value configuration for controlling simulation activity.
 */
export interface AlphaConfig<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
> {
  /**
   * Target alpha values for dragging.
   */
  readonly drag: {
    /**
     * Target alpha when a drag starts.
     * Should be larger than 0.
     */
    readonly start: number
    /**
     * Target alpha when a drag stops.
     * Should generally be 0.
     */
    readonly end: number
  }
  /**
   * Alpha values for filter changes.
   */
  readonly filter: {
    /**
     * Alpha value when the link filter changes.
     */
    readonly link: number
    /**
     * Alpha value when the node type filter changes.
     */
    readonly type: number
    /**
     * Alpha values when the inclusion of unlinked nodes changes.
     */
    readonly unlinked: {
      /**
       * Alpha value when unlinked nodes are included.
       */
      readonly include: number
      /**
       * Alpha value when unlinked nodes are excluded.
       */
      readonly exclude: number
    }
  }
  /**
   * Alpha values when node focus changes.
   */
  readonly focus: {
    /**
     * Alpha value when a node is focused.
     * @param node - The focused node.
     * @returns The alpha value.
     */
    readonly acquire: (node: Node) => number
    /**
     * Alpha value when a node is unfocused.
     * @param node - The unfocused node.
     * @returns The alpha value.
     */
    readonly release: (node: Node) => number
  }
  /**
   * Alpha value when the graph is initialized.
   */
  readonly initialize: number
  /**
   * Alpha values when label display changes.
   */
  readonly labels: {
    /**
     * Alpha values when link label display changes.
     */
    readonly links: LabelAlphas
    /**
     * Alpha values when node label display changes.
     */
    readonly nodes: LabelAlphas
  }
  /**
   * Alpha values when the graph is resized.
   */
  readonly resize: number | ((context: ResizeContext) => number)
}

/**
 * Create the default alpha configuration.
 */
export function createDefaultAlphaConfig<
  T extends NodeTypeToken,
  Node extends GraphNode<T>,
>(): AlphaConfig<T, Node> {
  return {
    drag: {
      end: 0,
      start: 0.1,
    },
    filter: {
      link: 1,
      type: 0.1,
      unlinked: {
        include: 0.1,
        exclude: 0.1,
      },
    },
    focus: {
      acquire: () => 0.1,
      release: () => 0.1,
    },
    initialize: 1,
    labels: {
      links: {
        hide: 0,
        show: 0,
      },
      nodes: {
        hide: 0,
        show: 0,
      },
    },
    resize: 0.5,
  }
}
