import { describe, expect, it } from 'vitest'

import { Match } from '../src/match'

describe('Match', () => {
  it('set startInOld to "startInOld" field', () => {
    const match = new Match(2, 3, 4)
    expect(match.startInOld).toBe(2)
  })

  it('set startInNew to "startInNew" field', () => {
    const match = new Match(2, 3, 4)
    expect(match.startInNew).toBe(3)
  })

  it('set size to "size" field', () => {
    const match = new Match(2, 3, 4)
    expect(match.size).toBe(4)
  })

  it('endInOld - return where word ends in old phrase', () => {
    const match = new Match(2, 3, 4)
    expect(match.endInOld).toBe(6) // old position + size = 2 + 4
  })

  it('endInNew - return where word ends in new phrase', () => {
    const match = new Match(2, 3, 4)
    expect(match.endInNew).toBe(7) // new position + size = 3 + 4
  })
})
