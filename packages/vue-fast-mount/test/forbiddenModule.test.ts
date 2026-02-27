import { describe, test } from 'vitest'

describe('forbiddenModule', () => {
  test('throws as side-effect if imported', async ({ expect }) => {
    await expect(() => import('./forbiddenModule')).rejects.toThrowError(
      'The forbiddenModule was imported.',
    )
  })
})
