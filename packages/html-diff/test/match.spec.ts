import { describe, test } from 'vitest'

import { Match } from '../src/match'

describe('Match', () => {
  test('set startInOld to "startInOld" field', ({ expect }) => {
    const match = new Match(2, 3, 4)
    expect(match.startInOld).toBe(2)
  })

  test('set startInNew to "startInNew" field', ({ expect }) => {
    const match = new Match(2, 3, 4)
    expect(match.startInNew).toBe(3)
  })

  test('set size to "size" field', ({ expect }) => {
    const match = new Match(2, 3, 4)
    expect(match.size).toBe(4)
  })

  test('endInOld - return where word ends in old phrase', ({ expect }) => {
    const match = new Match(2, 3, 4)
    expect(match.endInOld).toBe(6) // old position + size = 2 + 4
  })

  test('endInNew - return where word ends in new phrase', ({ expect }) => {
    const match = new Match(2, 3, 4)
    expect(match.endInNew).toBe(7) // new position + size = 3 + 4
  })
})
