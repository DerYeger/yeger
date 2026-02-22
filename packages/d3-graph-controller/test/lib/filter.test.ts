import { describe, test } from 'vitest'

import { filterGraph } from '../../src/lib/filter'
import type { GraphLink } from '../../src/model/link'
import type { TestNodeType } from '../test-data'
import TestData from '../test-data'

describe('filter', () => {
  test('can filter nothing', ({ expect }) => {
    const filteredResult = filterGraph({
      filter: ['first', 'second'],
      focusedNode: undefined,
      includeUnlinked: true,
      linkFilter: () => true,
      graph: TestData.graph,
    })
    expect(filteredResult).toEqual(TestData.graph)
  })

  test('can filter by type', ({ expect }) => {
    const filteredResult = filterGraph({
      filter: ['first'],
      focusedNode: undefined,
      includeUnlinked: false,
      linkFilter: () => true,
      graph: TestData.graph,
    })
    expect(filteredResult.nodes).toEqual(
      TestData.graph.nodes.filter((node) => node.type === 'first'),
    )
  })

  test('can filter unlinked', ({ expect }) => {
    const filteredResult = filterGraph({
      filter: ['first', 'second'],
      focusedNode: undefined,
      includeUnlinked: false,
      linkFilter: () => true,
      graph: TestData.graph,
    })
    expect(filteredResult.nodes).toEqual(
      TestData.graph.nodes.filter((node) =>
        TestData.graph.links.some(
          (link) => link.source.id === node.id || link.target.id === node.id,
        ),
      ),
    )
    expect(filteredResult.links).toEqual(TestData.graph.links)
  })

  test('can filter links', ({ expect }) => {
    const filteredResult = filterGraph({
      filter: ['first', 'second'],
      focusedNode: undefined,
      includeUnlinked: true,
      linkFilter: (link: GraphLink<TestNodeType>) => link.source.id === link.target.id,
      graph: TestData.graph,
    })
    expect(filteredResult.links.length).toEqual(1)
  })
})
