import { describe, test } from 'vitest'

import * as as from '../src/async'
import { TestUtils } from './test-utils'

describe('async streams', () => {
  test('works with complex chains', async ({ expect }) => {
    const res = await as.toArray(
      as.pipe(
        [null, 0, 1, 2, undefined, 3, 4, 5, 6, 7, 8, 9],
        as.filterDefined(),
        as.limit(6),
        as.filter((x) => x % 2 !== 0),
        as.map((x) => x * 2),
        as.map((x) => `${x}.0`),
      ),
    )
    expect(res).toEqual(['2.0', '6.0', '10.0'])
  })

  test('can sum', async ({ expect }) => {
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

    const streamResult = await as.sum(TestUtils.asyncTestStream)
    expect(streamResult).toEqual(forOfResult)
  })

  test('can sum non-numbers', async ({ expect }) => {
    const streamResult = await as.sum(
      as.pipe(['hello', 'world', '!'], as.limit(2)),
      (x) => x.length,
    )
    expect(streamResult).toEqual(10)
  })

  test('can iterate objects', async ({ expect }) => {
    const streamResult = await as.toArray(
      as.pipe(
        as.fromObject({
          hello: 'world',
          5: true,
        }),
        as.map(([key, value]) => `${key} ${value}`),
      ),
    )
    expect(streamResult).toEqual(['5 true', 'hello world'])
  })

  test('can create a map with a mapper', async ({ expect }) => {
    const streamResult = await as.toMap(
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

  test('can flatmap', async ({ expect }) => {
    const streamResult = await as.toArray(
      as.pipe(
        [1, 2, 3],
        as.flatMap((x) => [x, x]),
      ),
    )
    expect(streamResult).toEqual([1, 1, 2, 2, 3, 3])
  })

  test('can zip', async ({ expect }) => {
    const streamResult = await as.toArray(as.pipe([1, 2, 3], as.zip([4, 5, 6])))
    expect(streamResult).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ])
  })

  test('can be empty', async ({ expect }) => {
    const streamResult = await as.toArray([])
    expect(streamResult).toEqual([])
  })

  test('can have a single value', async ({ expect }) => {
    const streamResult = await as.toArray([1])
    expect(streamResult).toEqual([1])
  })

  test('can filter duplicates', async ({ expect }) => {
    const streamResult = await as.toArray(as.pipe([1, 2, 2, 3, 3, 3, 4, 4, 4, 4], as.distinct()))
    expect(streamResult).toEqual([1, 2, 3, 4])
  })

  test('can append streams', async ({ expect }) => {
    const streamResult = await as.toArray(as.pipe([1, 2, 3], as.append([4, 5, 6])))
    expect(streamResult).toEqual([1, 2, 3, 4, 5, 6])
  })

  test('can cache streams', async ({ expect }) => {
    let called = 0
    const source = as.pipe(
      [1],
      as.map((x) => {
        called++
        return x
      }),
    )
    const stream = as.pipe(source, as.cache())
    expect(await as.toArray(stream)).toEqual([1])
    expect(called).toBe(1)
    expect(await as.toArray(stream)).toEqual([1])
    expect(called).toBe(1)
  })

  test('can find an element', async ({ expect }) => {
    const streamResult = await as.find([1, 2, 3, 4, 5], (x) => x % 2 === 0)
    expect(streamResult).toEqual(2)
  })

  test('can check some', async ({ expect }) => {
    const streamResultTrue = await as.some([1, 2, 3, 4, 5], (x) => x % 2 === 0)
    const streamResultFalse = await as.some([1, 3, 5], (x) => x % 2 === 0)
    expect(streamResultTrue).toBe(true)
    expect(streamResultFalse).toBe(false)
  })

  test('can check every', async ({ expect }) => {
    const streamResultTrue = await as.every([2, 4, 6], (x) => x % 2 === 0)
    const streamResultFalse = await as.every([1, 2, 3], (x) => x % 2 === 0)
    expect(streamResultTrue).toBe(true)
    expect(streamResultFalse).toBe(false)
  })

  test('can join values', async ({ expect }) => {
    expect(await as.join([1, 2, 3], ',')).toBe('1,2,3')
    expect(await as.join([], ',')).toBe('')
  })
})
