import { afterEach, beforeEach, describe, test } from 'vitest'

import type { GraphLink } from '../src/index'
import { GraphController, defineGraphConfig } from '../src/index'
import type { TestNodeType } from './test-data'
import TestData from './test-data'

describe('GraphController', () => {
  let container: HTMLDivElement
  let controller: GraphController<TestNodeType>

  beforeEach(() => {
    container = document.createElement('div')
    controller = new GraphController(container, TestData.graph, TestData.config)
  })

  afterEach(() => controller.shutdown())

  test('matches the snapshot', ({ expect }) => {
    expect(container).toMatchSnapshot()
  })

  test('renders nodes', ({ expect }) => {
    expect(container.querySelectorAll('.node').length).toEqual(TestData.graph.nodes.length)
  })

  test('renders links', ({ expect }) => {
    expect(container.querySelectorAll('.link').length).toEqual(TestData.graph.links.length)
  })

  describe('can be configured', () => {
    describe('with initial settings', () => {
      test('that set the node type filter', ({ expect }) => {
        controller = new GraphController(
          container,
          TestData.graph,
          defineGraphConfig<TestNodeType>({ initial: { nodeTypeFilter: [] } }),
        )

        expect(controller.nodeTypeFilter).toEqual([])
        expect(container.querySelectorAll('.node').length).toEqual(0)
        expect(container.querySelectorAll('.link').length).toEqual(0)
      })

      test('that exclude unlinked nodes', ({ expect }) => {
        controller = new GraphController(
          container,
          TestData.graph,
          defineGraphConfig<TestNodeType>({
            initial: { includeUnlinked: false },
          }),
        )

        expect(controller.includeUnlinked).toEqual(false)
        expect(container.querySelectorAll('.node').length).toEqual(3)
      })

      test('that filter links', ({ expect }) => {
        controller = new GraphController(
          container,
          TestData.graph,
          defineGraphConfig<TestNodeType>({
            initial: {
              linkFilter: (link: GraphLink<TestNodeType>) => link.source.id === link.target.id,
            },
          }),
        )

        expect(container.querySelectorAll('.link').length).toEqual(1)
      })
    })
  })

  describe('has settings that', () => {
    test('can exclude unlinked nodes', ({ expect }) => {
      expect(container.querySelectorAll('.node').length).toEqual(TestData.graph.nodes.length)

      controller.includeUnlinked = false

      expect(container.querySelectorAll('.node').length).toEqual(3)
    })

    test('can filter links', ({ expect }) => {
      expect(container.querySelectorAll('.link').length).toEqual(TestData.graph.links.length)

      const linkFilter = (link: GraphLink<TestNodeType>) => link.source.id === link.target.id
      controller.linkFilter = linkFilter
      expect(controller.linkFilter).toBe(linkFilter)

      expect(container.querySelectorAll('.link').length).toEqual(1)
    })

    test('can filter by node type', ({ expect }) => {
      const currentlyExcluded: TestNodeType[] = []

      const checkIncludedNodes = () => {
        expect(container.querySelectorAll('.node').length).toEqual(
          TestData.graph.nodes.filter((node) => !currentlyExcluded.includes(node.type)).length,
        )
      }

      checkIncludedNodes()

      controller.filterNodesByType(false, 'second')
      currentlyExcluded.push('second')
      checkIncludedNodes()

      controller.filterNodesByType(false, 'first')
      currentlyExcluded.push('first')
      checkIncludedNodes()

      controller.filterNodesByType(true, 'first')
      currentlyExcluded.pop()
      checkIncludedNodes()

      controller.filterNodesByType(true, 'second')
      currentlyExcluded.pop()
      checkIncludedNodes()
    })

    test('can toggle node labels', ({ expect }) => {
      controller.showNodeLabels = true
      expect(
        [...container.querySelectorAll('.node__label')].every(
          (label) => (label as SVGTextElement).attributes.getNamedItem('opacity')?.value === '1',
        ),
      ).toBe(true)
      expect(controller.showNodeLabels).toBe(true)

      controller.showNodeLabels = false
      expect(
        [...container.querySelectorAll('.node__label')].every(
          (label) => (label as SVGTextElement).attributes.getNamedItem('opacity')?.value === '0',
        ),
      ).toBe(true)
      expect(controller.showNodeLabels).toBe(false)
    })

    test('can toggle link labels', ({ expect }) => {
      controller.showLinkLabels = true
      expect(
        [...container.querySelectorAll('.link__label')].some(
          (label) => (label as SVGTextElement).attributes.getNamedItem('opacity')?.value === '1',
        ),
      ).toBe(true)
      expect(controller.showLinkLabels).toBe(true)

      controller.showLinkLabels = false
      expect(
        [...container.querySelectorAll('.link__label')].every(
          (label) => (label as SVGTextElement).attributes.getNamedItem('opacity')?.value === '0',
        ),
      ).toBe(true)
      expect(controller.showLinkLabels).toBe(false)
    })
  })
})
