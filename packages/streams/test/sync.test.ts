import { describe, test } from 'vitest'

import { Stream } from '../src/index'
import { TestUtils } from './test-utils'

describe('sync streams', () => {
  test('works with complex chains', ({ expect }) => {
    const res = Stream.from([null, 0, 1, 2, undefined, 3, 4, 5, 6, 7, 8, 9])
      .filterNonNull()
      .limit(6)
      .filter((x) => x % 2 !== 0)
      .map((x) => x * 2)
      .map((x) => `${x}.0`)
      .toArray()
    expect(res).toEqual(['2.0', '6.0', '10.0'])
  })

  test('provides the index', ({ expect }) => {
    const res = Stream.from([false, 0, 'test']).map((_, index) => index)
    expect(res.toArray()).toEqual([0, 1, 2])
    expect(res.toArray()).toEqual([0, 1, 2])
  })

  test('can sum', ({ expect }) => {
    let count = 0
    let forOfResult = 0
    for (const item of TestUtils.source) {
      if (item % 2 === 0) {
        continue
      }
      count++
      forOfResult += TestUtils.fibonacci(Number.parseInt(`${item * 2}.5`, 10) % 20)
      if (count === TestUtils.limit) {
        break
      }
    }

    const streamResult = TestUtils.testStream.sum()
    expect(streamResult).toEqual(forOfResult)
  })

  test('can sum non-numbers', ({ expect }) => {
    const streamResult = Stream.from(['hello', 'world', '!'])
      .limit(2)
      .sum((x) => x.length)
    expect(streamResult).toEqual(10)
  })

  test('can iterate objects', ({ expect }) => {
    const streamResult = Stream.fromObject({ hello: 'world', 5: true })
      .map(([key, value]) => `${key} ${value}`)
      .toArray()
    expect(streamResult).toEqual(['5 true', 'hello world'])
  })

  test('can create a map with a mapper', ({ expect }) => {
    const streamResult = Stream.from([1, 2]).toMap((x) => x.toString())
    expect(streamResult).toEqual(
      new Map([
        ['1', 1],
        ['2', 2],
      ]),
    )
  })

  test('can flatmap', ({ expect }) => {
    const streamResult = Stream.from([[1], [2, 2], [3, 3, 3]])
      .flatMap((x) => Stream.from(x))
      .toArray()
    expect(streamResult).toEqual([1, 2, 2, 3, 3, 3])
  })

  test('can zip', ({ expect }) => {
    const streamResult = Stream.from([1, 2, 3])
      .zip(Stream.from(['a', 'b', 'c']))
      .toArray()
    expect(streamResult).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ])
  })

  test('can be empty', ({ expect }) => {
    const streamResult = Stream.empty().toArray()
    expect(streamResult).toEqual([])
  })

  test('can have a single value', ({ expect }) => {
    const streamResult = Stream.fromSingle(1).toArray()
    expect(streamResult).toEqual([1])
  })

  test('can filter duplicates', ({ expect }) => {
    const streamResult = Stream.from([1, 2, 2, 3, 3, 3, 4, 4, 4, 4]).distinct().toArray()
    expect(streamResult).toEqual([1, 2, 3, 4])
  })

  test('can concat streams', ({ expect }) => {
    const streamResult = Stream.from([1, 2, 3])
      .concat(Stream.from([4, 5, 6]))
      .toArray()
    expect(streamResult).toEqual([1, 2, 3, 4, 5, 6])
  })

  test('can cache streams', ({ expect }) => {
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

  test('can check some', ({ expect }) => {
    const streamResultTrue = Stream.from([1, 2, 3, 4, 5]).some((x) => x % 2 === 0)
    const streamResultFalse = Stream.from([1, 3, 5]).some((x) => x % 2 === 0)
    expect(streamResultTrue).toBe(true)
    expect(streamResultFalse).toBe(false)
  })

  test('can check every', ({ expect }) => {
    const streamResultTrue = Stream.from([2, 4, 6]).every((x) => x % 2 === 0)
    const streamResultFalse = Stream.from([1, 2, 3]).every((x) => x % 2 === 0)
    expect(streamResultTrue).toBe(true)
    expect(streamResultFalse).toBe(false)
  })
})
