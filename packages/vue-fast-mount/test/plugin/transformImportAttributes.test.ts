import { describe, test } from 'vitest'

import { transformImportAttributes } from '../../src/transformImportAttributes'
import {
  FAST_MOUNT_UNSTUB_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
} from '../../src/utils'

describe('transformVfmImportAttributes', () => {
  test('rewrites string true import attributes', ({ expect }) => {
    const input = `import Parent from './Parent.vue' with { vfm: 'true' }`

    const transformed = transformImportAttributes(input)

    expect(transformed?.code).toContain(
      `'./Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}'`,
    )
    expect(transformed?.code).not.toContain('with { vfm')
  })

  test('rewrites string component list to unstub query', ({ expect }) => {
    const input = `import Parent from './Parent.vue' with { vfm: 'Sibling, Header' }`

    const transformed = transformImportAttributes(input)

    expect(transformed?.code).toContain(
      `'./Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&${FAST_MOUNT_UNSTUB_QUERY_KEY}=Sibling%2CHeader'`,
    )
  })

  test('keeps non-vfm import attributes', ({ expect }) => {
    const input = `import Parent from './Parent.vue' with { type: 'macro', vfm: 'true' }`

    const transformed = transformImportAttributes(input)

    expect(transformed?.code).toContain(`with { type: 'macro' }`)
    expect(transformed?.code).not.toContain("with { type: 'macro', vfm")
  })

  test('returns null for files without vfm attribute', ({ expect }) => {
    const input = `import Parent from './Parent.vue'`
    expect(transformImportAttributes(input)).toBeNull()
  })

  test('rewrites single string component shorthand', ({ expect }) => {
    const input = `import Parent from './Parent.vue' with { vfm: 'Sibling' }`

    const transformed = transformImportAttributes(input)

    expect(transformed?.code).toContain(
      `'./Parent.vue?${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}&${FAST_MOUNT_UNSTUB_QUERY_KEY}=Sibling'`,
    )
  })

  test('does not rewrite unsupported non-string vfm values', ({ expect }) => {
    const input = `import Parent from './Parent.vue' with { vfm: false }`

    const transformed = transformImportAttributes(input)

    expect(transformed).toBeNull()
  })
})
