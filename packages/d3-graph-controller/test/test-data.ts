import { defineGraphConfig } from '~/config/config'
import type { Graph } from '~/model/graph'
import { defineGraph } from '~/model/graph'
import { defineLink } from '~/model/link'
import { defineNodeWithDefaults } from '~/model/node'

export type TestNodeType = 'first' | 'second'

const a = defineNodeWithDefaults<TestNodeType>({
  type: 'first',
  id: 'a',
})

const b = defineNodeWithDefaults<TestNodeType>({
  type: 'first',
  id: 'b',
})

const c = defineNodeWithDefaults<TestNodeType>({
  type: 'first',
  id: 'c',
  label: false,
})

const d = defineNodeWithDefaults<TestNodeType>({
  type: 'second',
  id: 'd',
})

const aToB = defineLink<TestNodeType>({
  source: a,
  target: b,
  color: 'gray',
  label: {
    color: 'black',
    fontSize: '1rem',
    text: 'aToB',
  },
})

const bToA = defineLink<TestNodeType>({
  source: b,
  target: a,
  color: 'gray',
  label: {
    color: 'black',
    fontSize: '1rem',
    text: 'bToA',
  },
})

const bToC = defineLink<TestNodeType>({
  source: b,
  target: c,
  color: 'gray',
  label: {
    color: 'black',
    fontSize: '1rem',
    text: 'bToC',
  },
})

const cToC = defineLink<TestNodeType>({
  source: c,
  target: c,
  color: 'gray',
  label: false,
})

const graph: Graph<TestNodeType> = defineGraph<TestNodeType>({
  nodes: [a, b, c, d],
  links: [aToB, bToA, bToC, cToC],
})

const config = defineGraphConfig<TestNodeType>()

export default {
  graph,
  config,
}
