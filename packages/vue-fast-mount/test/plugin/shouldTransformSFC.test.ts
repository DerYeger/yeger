import { describe, test } from 'vitest'

import { shouldTransformSFC } from '../../src/plugin/shouldTransformSFC'
import { FAST_MOUNT_QUERY_KEY, FAST_MOUNT_QUERY_VALUE } from '../../src/plugin/utils'

describe('shouldTransformSFC', () => {
  test('returns true if query contains the correct key and value', ({ expect }) => {
    expect(
      shouldTransformSFC(new URLSearchParams(`${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}`)),
    ).toBe(true)
  })

  test('returns false if query is missing the key', ({ expect }) => {
    expect(shouldTransformSFC(new URLSearchParams(`somethingElse=${FAST_MOUNT_QUERY_VALUE}`))).toBe(
      false,
    )
  })

  test('returns false if query has the wrong value', ({ expect }) => {
    expect(shouldTransformSFC(new URLSearchParams(`${FAST_MOUNT_QUERY_KEY}=other-value`))).toBe(
      false,
    )
  })
})
