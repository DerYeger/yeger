import { describe, test } from 'vitest'

import * as as from '../src/async'
import * as s from '../src/sync'

function* naturalNumbers() {
  let i = 0
  while (true) {
    yield i++
  }
}

async function* asyncNaturalNumbers() {
  let i = 0
  while (true) {
    yield i++
  }
}

describe('infinite', () => {
  test('sync stream works', ({ expect }) => {
    const firstTenNumbers = s.toArray(s.pipe(naturalNumbers(), s.limit(10)))
    expect(firstTenNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  test('async stream works', async ({ expect }) => {
    const firstTenNumbers = await as.toArray(as.pipe(asyncNaturalNumbers(), as.limit(10)))
    expect(firstTenNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
