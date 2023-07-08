import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { GraphController, defineGraphConfig } from '~/main'
import type { GraphLink } from '~/main'
import TestData from '~test/test-data'
import type { TestNodeType } from '~test/test-data'

describe('GraphController', () => {
  let container: HTMLDivElement
  let controller: GraphController<TestNodeType>

  beforeEach(() => {
    container = document.createElement('div')
    controller = new GraphController(container, TestData.graph, TestData.config)
  })

  afterEach(() => controller.shutdown())

  it('matches the snapshot', () => {
    expect(container).toMatchSnapshot()
  })

  it('renders nodes', () => {
    expect(container.querySelectorAll('.node').length).toEqual(
      TestData.graph.nodes.length,
    )
  })

  it('renders links', () => {
    expect(container.querySelectorAll('.link').length).toEqual(
      TestData.graph.links.length,
    )
  })

  describe('can be configured', () => {
    describe('with initial settings', () => {
      it('that set the node type filter', () => {
        controller = new GraphController(
          container,
          TestData.graph,
          defineGraphConfig<TestNodeType>({ initial: { nodeTypeFilter: [] } }),
        )

        expect(controller.nodeTypeFilter).toEqual([])
        expect(container.querySelectorAll('.node').length).toEqual(0)
        expect(container.querySelectorAll('.link').length).toEqual(0)
      })

      it('that exclude unlinked nodes', () => {
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

      it('that filter links', () => {
        controller = new GraphController(
          container,
          TestData.graph,
          defineGraphConfig<TestNodeType>({
            initial: {
              linkFilter: (link: GraphLink<TestNodeType>) =>
                link.source.id === link.target.id,
            },
          }),
        )

        expect(container.querySelectorAll('.link').length).toEqual(1)
      })
    })
  })

  describe('has settings that', () => {
    it('can exclude unlinked nodes', () => {
      expect(container.querySelectorAll('.node').length).toEqual(
        TestData.graph.nodes.length,
      )

      controller.includeUnlinked = false

      expect(container.querySelectorAll('.node').length).toEqual(3)
    })

    it('can filter links', () => {
      expect(container.querySelectorAll('.link').length).toEqual(
        TestData.graph.links.length,
      )

      controller.linkFilter = (link: GraphLink<TestNodeType>) =>
        link.source.id === link.target.id

      expect(container.querySelectorAll('.link').length).toEqual(1)
    })

    it('can filter by node type', () => {
      const currentlyExcluded: TestNodeType[] = []

      const checkIncludedNodes = () => {
        expect(container.querySelectorAll('.node').length).toEqual(
          TestData.graph.nodes.filter(
            (node) => !currentlyExcluded.includes(node.type),
          ).length,
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
  })
})
