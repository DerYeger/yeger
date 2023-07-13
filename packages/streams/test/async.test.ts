import { describe, expect, it } from 'vitest'

import { AsyncStream, Stream } from '~/index'
import { TestUtils } from '~test/test-utils'

describe('async streams', () => {
  it('works with complex chains', async () => {
    const res = await AsyncStream.from([
      null,
      0,
      1,
      2,
      undefined,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ])
      .filterNonNull()
      .limit(6)
      .filter((x) => x % 2 !== 0)
      .map((x) => x * 2)
      .map((x) => `${x}.0`)
      .toArray()
    expect(res).toEqual(['2.0', '6.0', '10.0'])
  })

  it('can sum', async () => {
    let count = 0
    let forOfResult = 0
    for (const item of TestUtils.source) {
      if (item % 2 === 0) {
        continue
      }
      count++
      forOfResult += TestUtils.fibonacci(
        Number.parseInt(`${item * 2}.5`, 10) % 20,
      )
      if (count === TestUtils.limit) {
        break
      }
    }

    const streamResult = await TestUtils.asyncTestStream.sum()
    expect(streamResult).toEqual(forOfResult)
  })

  it('can sum non-numbers', async () => {
    const streamResult = await AsyncStream.from(['hello', 'world', '!'])
      .limit(2)
      .sum((x) => x.length)
    expect(streamResult).toEqual(10)
  })

  it('can iterate objects', async () => {
    const streamResult = await AsyncStream.fromObject({
      hello: 'world',
      5: true,
    })
      .map(([key, value]) => `${key} ${value}`)
      .toArray()
    expect(streamResult).toEqual(['5 true', 'hello world'])
  })

  it('can create a map with a mapper', async () => {
    const streamResult = await AsyncStream.from([1, 2]).toMap((x) =>
      x.toString(),
    )
    expect(streamResult).toEqual(
      new Map([
        ['1', 1],
        ['2', 2],
      ]),
    )
  })

  it('can flatmap', async () => {
    const streamResult = await AsyncStream.from([1, 2, 3])
      .flatMap((x) => [x, x])
      .toArray()
    expect(streamResult).toEqual([1, 1, 2, 2, 3, 3])
  })

  it('can zip', async () => {
    const streamResult = await AsyncStream.from([1, 2, 3])
      .zip([4, 5, 6])
      .toArray()
    expect(streamResult).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ])
  })

  it('can transform to async', async () => {
    const a = await AsyncStream.from([1, 2, 3])
      .map((x) => 2 * x)
      .filter((x) => x % 3 !== 0)
      .toArray()
    const b = await Stream.from([1, 2, 3])
      .map((x) => 2 * x)
      .toAsync()
      .filter((x) => x % 3 !== 0)
      .toArray()
    expect(a).toEqual([2, 4])
    expect(b).toEqual([2, 4])
  })
})
