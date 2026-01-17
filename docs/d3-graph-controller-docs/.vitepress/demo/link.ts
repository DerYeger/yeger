import type { GraphLink } from 'd3-graph-controller'
import { defineLink } from 'd3-graph-controller'

import type { DemoType } from './model'
import type { DemoNode } from './node'
import { nodes } from './node'

export interface DemoLink extends GraphLink<DemoType, DemoNode> {
  weight: number
}

export function defineDemoLink(source: DemoNode, target: DemoNode, weight: number): DemoLink {
  return defineLink<DemoType, DemoNode, DemoNode, DemoLink>({
    source,
    target,
    color: `var(--color-secondary)`,
    label: {
      color: 'var(--text-on-secondary)',
      fontSize: '1rem',
      text: weight.toString(),
    },
    weight,
  })
}

const aToB: DemoLink = defineDemoLink(nodes.a, nodes.b, 1)

const bToA: DemoLink = defineDemoLink(nodes.b, nodes.a, 5)

const bToC: DemoLink = defineDemoLink(nodes.b, nodes.c, 1.5)

const cToC: DemoLink = defineDemoLink(nodes.c, nodes.c, 1)

export const links = {
  aToB,
  bToA,
  bToC,
  cToC,
}
