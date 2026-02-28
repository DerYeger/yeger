import { describe, test } from 'vitest'

import { getUnstubbedComponentFromId } from '../../src/plugin/getUnstubbedComponentFromId'

describe('getUnstubbedComponentFromId', () => {
  test('reads keep bindings from query', ({ expect }) => {
    expect(
      [...getUnstubbedComponentFromId('/tmp/Parent.vue?__vfm=1&__vfm_keep=Sibling,Child')].sort(),
    ).toStrictEqual(['Child', 'Sibling'])
    expect(getUnstubbedComponentFromId('/tmp/Parent.vue')).toStrictEqual(new Set())
    expect(getUnstubbedComponentFromId('/tmp/Parent.vue?__vfm=1')).toStrictEqual(new Set())
  })
})
