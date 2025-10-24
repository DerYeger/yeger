import { describe, expect, it } from 'vitest'

import { Stream } from '~/index'
import { TestUtils } from '~test/test-utils'

describe('sync streams', () => {
  it('works with complex chains', () => {
    const res = Stream.from([null, 0, 1, 2, undefined, 3, 4, 5, 6, 7, 8, 9])
      .filterNonNull()
      .limit(6)
      .filter((x) => x % 2 !== 0)
      .map((x) => x * 2)
      .map((x) => `${x}.0`)
      .toArray()
    expect(res).toEqual(['2.0', '6.0', '10.0'])
  })

  it('provides the index', () => {
    const res = Stream.from([false, 0, 'test']).map((_, index) => index)
    expect(res.toArray()).toEqual([0, 1, 2])
    expect(res.toArray()).toEqual([0, 1, 2])
  })

  it('can sum', () => {
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

    const streamResult = TestUtils.testStream.sum()
    expect(streamResult).toEqual(forOfResult)
  })

  it('can sum non-numbers', () => {
    const streamResult = Stream.from(['hello', 'world', '!'])
      .limit(2)
      .sum((x) => x.length)
    expect(streamResult).toEqual(10)
  })

  it('can iterate objects', () => {
    const streamResult = Stream.fromObject({ hello: 'world', 5: true })
      .map(([key, value]) => `${key} ${value}`)
      .toArray()
    expect(streamResult).toEqual(['5 true', 'hello world'])
  })

  it('can create a map with a mapper', () => {
    const streamResult = Stream.from([1, 2]).toMap((x) => x.toString())
    expect(streamResult).toEqual(
      new Map([
        ['1', 1],
        ['2', 2],
      ]),
    )
  })

  it('can flatmap', () => {
    const streamResult = Stream.from([[1], [2, 2], [3, 3, 3]])
      .flatMap((x) => Stream.from(x))
      .toArray()
    expect(streamResult).toEqual([1, 2, 2, 3, 3, 3])
  })

  it('can zip', () => {
    const streamResult = Stream.from([1, 2, 3])
      .zip(Stream.from(['a', 'b', 'c']))
      .toArray()
    expect(streamResult).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ])
  })

  it('can be empty', () => {
    const streamResult = Stream.empty().toArray()
    expect(streamResult).toEqual([])
  })

  it('can have a single value', () => {
    const streamResult = Stream.fromSingle(1).toArray()
    expect(streamResult).toEqual([1])
  })

  it('can filter duplicates', () => {
    const streamResult = Stream.from([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])
      .distinct()
      .toArray()
    expect(streamResult).toEqual([1, 2, 3, 4])
  })

  it('can concat streams', () => {
    const streamResult = Stream.from([1, 2, 3])
      .concat(Stream.from([4, 5, 6]))
      .toArray()
    expect(streamResult).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('can cache streams', () => {
    let called = 0
    const source = Stream.fromSingle(1).map((x) => {
      called++
      return x
    })
    const stream = source.cache()
    expect(stream.toArray()).toEqual([1])
    expect(called).toBe(1)
    expect(stream.toArray()).toEqual([1])
    expect(called).toBe(1)
  })

    it('can check some', () => {
      const streamResultTrue = Stream.from([1, 2, 3, 4, 5]).some(
        (x) => x % 2 === 0,
      )
      const streamResultFalse = Stream.from([1, 3, 5]).some(
        (x) => x % 2 === 0,
      )
      expect(streamResultTrue).toBe(true)
      expect(streamResultFalse).toBe(false)
    })

    it('can check every', () => {
      const streamResultTrue = Stream.from([2, 4, 6]).every(
        (x) => x % 2 === 0,
      )
      const streamResultFalse = Stream.from([1, 2, 3]).every(
        (x) => x % 2 === 0,
      )
      expect(streamResultTrue).toBe(true)
      expect(streamResultFalse).toBe(false)
    })
})
