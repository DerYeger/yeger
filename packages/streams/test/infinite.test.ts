import { describe, expect, it } from 'vitest'

import { AsyncStream, Stream } from '../src/index'

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
  it('sync stream works', () => {
    const firstTenNumbers = Stream.from(naturalNumbers()).limit(10).toArray()
    expect(firstTenNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('async stream works', async () => {
    const firstTenNumbers = await AsyncStream.from(asyncNaturalNumbers()).limit(10).toArray()
    expect(firstTenNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
