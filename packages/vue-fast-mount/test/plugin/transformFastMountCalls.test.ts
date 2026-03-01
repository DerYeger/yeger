import { describe, test } from 'vitest'

import { transformFastMountCalls } from '../../src/plugin/transformFastMountCalls'
import {
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
} from '../../src/plugin/utils'

describe('rewriteFastMountCallsite', () => {
  test('adds import parameters', ({ expect }) => {
    const input = [
      `import { fastMount as fm } from 'vue-fast-mount'`,
      `await fm(import('./Parent.vue'), { global: { stubs: { Sibling: false } } })`,
      'await fastMount(import("./Sibling.vue"))',
    ].join('\n')
    const expectedOutput = [
      `import { fastMount as fm } from 'vue-fast-mount'`,
      `await fm(import('./Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&${FAST_MOUNT_UNSTUB_QUERY_KEY}=Sibling'), { global: { stubs: { Sibling: false } } })`,
      `await fastMount(import("./Sibling.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}"))`,
    ].join('\n')
    const transformed = transformFastMountCalls(input)
    expect(transformed?.code).toBe(expectedOutput)
  })

  test('does not rewrite unrelated calls or non-vue imports', ({ expect }) => {
    const input = [
      `import { fastMount as fm } from 'vue-fast-mount'`,
      `import { fastMount } from 'somewhere-else'`,
      `await fastMount(import('./A.vue'))`,
      `await fm(import('./B.ts'))`,
      `obj.fastMount(import('./C.vue'))`,
    ].join('\n')
    const transformed = transformFastMountCalls(input)
    expect(transformed).toBeNull()
  })
})
