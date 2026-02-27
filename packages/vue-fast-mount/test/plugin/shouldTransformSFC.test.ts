import { describe, test } from 'vitest'

import { shouldTransformSFC } from '../../src/plugin/shouldTransformSFC'

describe('shouldTransformSFC', () => {
  test('detects transform IDs', ({ expect }) => {
    expect(shouldTransformSFC('/tmp/Parent.vue?__vfm=1')).toBe(true)
    expect(shouldTransformSFC('/tmp/Parent.vue?__vfm=1&type=template')).toBe(false)
    expect(shouldTransformSFC('/tmp/Parent.vue?foo=bar')).toBe(false)
    expect(shouldTransformSFC('/tmp/Parent.vue')).toBe(false)
    expect(shouldTransformSFC('/tmp/Parent.ts?__vfm=1')).toBe(false)
  })
})
