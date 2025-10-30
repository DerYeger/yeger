import { describe, expect, it } from 'vitest'

import { AsyncStream } from '../src/index'
import { TestUtils } from './test-utils'

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

  it('can be empty', async () => {
    const streamResult = await AsyncStream.empty().toArray()
    expect(streamResult).toEqual([])
  })

  it('can have a single value', async () => {
    const streamResult = await AsyncStream.fromSingle(1).toArray()
    expect(streamResult).toEqual([1])
  })

  it('can filter duplicates', async () => {
    const streamResult = await AsyncStream.from([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])
      .distinct()
      .toArray()
    expect(streamResult).toEqual([1, 2, 3, 4])
  })

  it('can concat streams', async () => {
    const streamResult = await AsyncStream.from([1, 2, 3])
      .concat(AsyncStream.from([4, 5, 6]))
      .toArray()
    expect(streamResult).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('can cache streams', async () => {
    let called = 0
    const source = AsyncStream.fromSingle(1).map((x) => {
      called++
      return x
    })
    const stream = source.cache()
    expect(await stream.toArray()).toEqual([1])
    expect(called).toBe(1)
    expect(await stream.toArray()).toEqual([1])
    expect(called).toBe(1)
  })

  it('can find an element', async () => {
    const streamResult = await AsyncStream.from([1, 2, 3, 4, 5]).find(
      (x) => x % 2 === 0,
    )
    expect(streamResult).toEqual(2)
  })

  it('can check some', async () => {
    const streamResultTrue = await AsyncStream.from([1, 2, 3, 4, 5]).some(
      (x) => x % 2 === 0,
    )
    const streamResultFalse = await AsyncStream.from([1, 3, 5]).some(
      (x) => x % 2 === 0,
    )
    expect(streamResultTrue).toBe(true)
    expect(streamResultFalse).toBe(false)
  })

  it('can check every', async () => {
    const streamResultTrue = await AsyncStream.from([2, 4, 6]).every(
      (x) => x % 2 === 0,
    )
    const streamResultFalse = await AsyncStream.from([1, 2, 3]).every(
      (x) => x % 2 === 0,
    )
    expect(streamResultTrue).toBe(true)
    expect(streamResultFalse).toBe(false)
  })
})
