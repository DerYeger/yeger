import { describe, test } from 'vitest'

import { getUnstubbedComponents } from '../../src/plugin/getUnstubbedComponent'
import { FAST_MOUNT_UNSTUB_QUERY_KEY } from '../../src/plugin/utils'

describe('getUnstubbedComponent', () => {
  test('returns an empty set if parameter is missing', ({ expect }) => {
    expect(getUnstubbedComponents(new URLSearchParams())).toStrictEqual(new Set())
    expect(getUnstubbedComponents(new URLSearchParams('foo=bar'))).toStrictEqual(new Set())
  })

  test('returns a set of component names from the query', ({ expect }) => {
    expect(
      getUnstubbedComponents(new URLSearchParams(`${FAST_MOUNT_UNSTUB_QUERY_KEY}=Sibling,Child`)),
    ).toStrictEqual(new Set(['Sibling', 'Child']))
  })

  test('trims whitespace and ignores empty bindings', ({ expect }) => {
    expect(
      getUnstubbedComponents(
        new URLSearchParams(`${FAST_MOUNT_UNSTUB_QUERY_KEY}= Sibling , , Child `),
      ),
    ).toStrictEqual(new Set(['Sibling', 'Child']))
  })
})
