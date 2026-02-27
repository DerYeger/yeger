import { describe, test } from 'vitest'

import { getKeepBindingsFromId } from '../../src/plugin/getKeepBindingsFromId'

describe('getKeepBindingsFromId', () => {
  test('reads keep bindings from query', ({ expect }) => {
    expect(
      [...getKeepBindingsFromId('/tmp/Parent.vue?__vfm=1&__vfm_keep=Sibling,Child')].sort(),
    ).toStrictEqual(['Child', 'Sibling'])
    expect(getKeepBindingsFromId('/tmp/Parent.vue')).toStrictEqual(new Set())
    expect(getKeepBindingsFromId('/tmp/Parent.vue?__vfm=1')).toStrictEqual(new Set())
  })
})
