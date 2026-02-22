import { describe, test } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

describe('sync streams', () => {
  test('works with complex chains', ({ expect }) => {
    const res = s.toArray(
      s.pipe(
        [null, 0, 1, 2, undefined, 3, 4, 5, 6, 7, 8, 9],
        s.filterDefined(),
        s.limit(6),
        s.filter((x) => x % 2 !== 0),
        s.map((x) => x * 2),
        s.map((x) => `${x}.0`),
      ),
    )
    expect(res).toEqual(['2.0', '6.0', '10.0'])
  })

  test('provides the index', ({ expect }) => {
    const res = s.pipe(
      [false, 0, 'test'],
      s.map((_, index) => index),
    )
    expect(s.toArray(res)).toEqual([0, 1, 2])
    expect(s.toArray(res)).toEqual([0, 1, 2])
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

    const streamResult = s.sum(TestUtils.testStream)
    expect(streamResult).toEqual(forOfResult)
  })

  test('can sum non-numbers', ({ expect }) => {
    const streamResult = s.sum(s.pipe([1, 2, 3], s.limit(2)), (x) => x * 2)
    expect(streamResult).toEqual(6)
  })

  test('can iterate objects', ({ expect }) => {
    const streamResult = s.toArray(
      s.pipe(
        s.fromObject({ hello: 'world', 5: true }),
        s.map(([key, value]) => `${key} ${value}`),
      ),
    )
    expect(streamResult).toEqual(['5 true', 'hello world'])
  })

  test('can create a map with a mapper', ({ expect }) => {
    const streamResult = s.toMap(
      [1, 2],
      (x) => x.toString(),
      (x) => x,
    )
    expect(streamResult).toEqual(
      new Map([
        ['1', 1],
        ['2', 2],
      ]),
    )
  })

  test('can flatmap', ({ expect }) => {
    const streamResult = s.toArray(
      s.pipe(
        [[1], [2, 2], [3, 3, 3]],
        s.flatMap((x) => x),
      ),
    )
    expect(streamResult).toEqual([1, 2, 2, 3, 3, 3])
  })

  test('can zip', ({ expect }) => {
    const streamResult = s.toArray(s.pipe([1, 2, 3], s.zip(['a', 'b', 'c'])))
    expect(streamResult).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ])
  })

  test('can be empty', ({ expect }) => {
    const streamResult = s.toArray([])
    expect(streamResult).toEqual([])
  })

  test('can have a single value', ({ expect }) => {
    const streamResult = s.toArray([1])
    expect(streamResult).toEqual([1])
  })

  test('can filter duplicates', ({ expect }) => {
    const streamResult = s.toArray(s.pipe([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], s.distinct()))
    expect(streamResult).toEqual([1, 2, 3, 4])
  })

  test('can append streams', ({ expect }) => {
    const streamResult = s.toArray(s.pipe([1, 2, 3], s.append([4, 5, 6])))
    expect(streamResult).toEqual([1, 2, 3, 4, 5, 6])
  })

  test('can cache streams', ({ expect }) => {
    let called = 0
    const source = s.pipe(
      [1],
      s.map((x) => {
        called++
        return x
      }),
    )
    const stream = s.pipe(source, s.cache())
    expect(s.toArray(stream)).toEqual([1])
    expect(called).toBe(1)
    expect(s.toArray(stream)).toEqual([1])
    expect(called).toBe(1)
  })

  test('can check some', ({ expect }) => {
    const streamResultTrue = s.some([1, 2, 3, 4, 5], (x) => x % 2 === 0)
    const streamResultFalse = s.some([1, 3, 5], (x) => x % 2 === 0)
    expect(streamResultTrue).toBe(true)
    expect(streamResultFalse).toBe(false)
  })

  test('can check every', ({ expect }) => {
    const streamResultTrue = s.every([2, 4, 6], (x) => x % 2 === 0)
    const streamResultFalse = s.every([1, 2, 3], (x) => x % 2 === 0)
    expect(streamResultTrue).toBe(true)
    expect(streamResultFalse).toBe(false)
  })

  test('can join values', ({ expect }) => {
    expect(s.join([1, 2, 3], ',')).toBe('1,2,3')
    expect(s.join([], ',')).toBe('')
  })
})
