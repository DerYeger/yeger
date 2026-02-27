import { describe, test } from 'vitest'

describe('Child', () => {
  test('throws as side-effect if imported', async ({ expect }) => {
    await expect(() => import('./Child.vue')).rejects.toThrowError(
      'The forbiddenModule was imported.',
    )
  })
})
