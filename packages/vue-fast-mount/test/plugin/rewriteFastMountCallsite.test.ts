import { describe, test } from 'vitest'

import { rewriteFastMountCallsites } from '../../src/plugin/rewriteFastMountCallsites'

describe('rewriteFastMountCallsite', () => {
  test('adds import parameters', ({ expect }) => {
    const code = [
      `import { fastMount as fm } from 'vue-fast-mount'`,
      `await fm(import('./Parent.vue'), { global: { stubs: { Sibling: false } } })`,
    ].join('\n')

    const transformed = rewriteFastMountCallsites(code)

    expect(transformed).toContain('./Parent.vue?__vfm=1&__vfm_keep=Sibling')
  })
})
