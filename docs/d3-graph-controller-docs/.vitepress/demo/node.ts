import type { GraphNode } from 'd3-graph-controller'
import { defineNode } from 'd3-graph-controller'

import type { DemoType } from './model'

export interface DemoNode extends GraphNode<DemoType> {
  radiusMultiplier: number
}

export function defineDemoNode(
  id: string,
  type: DemoType,
  radiusMultiplier: number
): DemoNode {
  return defineNode<DemoType, DemoNode>({
    id,
    type,
    isFocused: false,
    color: `var(--color-${type})`,
    label: {
      color: 'var(--text-on-node)',
      fontSize: '1rem',
      text: id.toUpperCase(),
    },
    radiusMultiplier,
  })
}

export const nodes = {
  a: defineDemoNode('a', 'primary', 1.25),
  b: defineDemoNode('b', 'primary', 1),
  c: defineDemoNode('c', 'secondary', 0.8),
  d: defineDemoNode('d', 'primary', 1),
}
