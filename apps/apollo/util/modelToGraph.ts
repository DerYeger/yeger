import type { Model } from '@yeger/fol'
import type { Graph, GraphLink, GraphNode } from 'd3-graph-controller'
import { defineLink, defineNodeWithDefaults } from 'd3-graph-controller'

export function modelToGraph(model: Model): Graph {
  const nodes: Record<string, GraphNode> = Object.fromEntries(
    [...model.domain.values()].map((element) => [
      element.toString(),
      defineNodeWithDefaults({
        id: element.toString(),
        type: 'element',
        color: 'var(--green)',
        label: {
          fontSize: '0.875rem',
          color: '#1c1917',
          text: makeNodeLabel(element, model),
        },
      }),
    ])
  )
  const linkData: Record<`${number},${number}`, string[]> = {}
  Object.values(model.functions).forEach((func) => {
    if (func.arity !== 1) {
      return
    }
    Object.entries(func.data).forEach(([source, target]) => {
      const index = `${+source},${target}` as const
      if (!linkData[index]) {
        linkData[index] = []
      }
      linkData[index].push(func.name)
    })
  })
  Object.values(model.relations).forEach((relation) => {
    if (relation.arity !== 2) {
      return
    }
    ;[...relation.data.values()]
      .map((entry) => entry.split(','))
      .forEach(([source, target]) => {
        const index = `${+source},${+target}` as const
        if (!linkData[index]) {
          linkData[index] = []
        }
        linkData[index].push(relation.name)
      })
  })
  const links: GraphLink[] = []
  Object.entries(linkData).forEach(([ident, labels]) => {
    const [source, target] = ident.split(',')
    const sourceNode = nodes[source]
    const targetNode = nodes[target]
    if (!sourceNode || !targetNode) {
      return undefined
    }
    const link = defineLink({
      source: sourceNode,
      target: targetNode,
      color: '#a8a29e',
      label: {
        fontSize: '0.875rem',
        text: labels.join(','),
        color: '#1c1917',
      },
    })
    links.push(link)
  })
  return {
    nodes: Object.values(nodes),
    links,
  }
}

function makeNodeLabel(element: number, model: Model): string {
  const relations = Object.values(model.relations)
    .filter((rel) => rel.arity === 1 && rel.includes(element))
    .map((rel) => rel.name)
  const constants = Object.entries(model.constants)
    .filter(([_, el]) => el === element)
    .map(([name, _]) => name)
  const attributes = [...constants, ...relations]
  if (attributes.length === 0) {
    return element.toString()
  }
  return `${element}: ${attributes.join(',')}`
}
