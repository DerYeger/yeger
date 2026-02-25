import { describe, test } from 'vitest'

describe('forbiddenModule', () => {
  test('should throw if forbiddenModule.ts is imported', async ({ expect }) => {
    await expect(() => import('./forbiddenModule')).rejects.toThrowError(
      'The forbiddenModule was imported.',
    )
  })
})
