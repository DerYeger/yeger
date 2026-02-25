import { describe, test, vi } from 'vitest'

import * as as from '../src/async'
import { TestUtils } from './test-utils'

describe('async streams', () => {
  describe('sources', () => {
    test('can be empty', async ({ expect }) => {
      const streamResult = await as.toArray([])
      expect(streamResult).toEqual([])
    })

    test('can have a single value', async ({ expect }) => {
      const streamResult = await as.toArray([1])
      expect(streamResult).toEqual([1])
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
  })

  describe('operators', () => {
    test('can pipe', async ({ expect }) => {
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

    test('can map', async ({ expect }) => {
      const res = await as.toArray(
        as.pipe(
          [false, 0, 'test'],
          as.map((value, index) => [value, index]),
        ),
      )
      expect(res).toEqual([
        [false, 0],
        [0, 1],
        ['test', 2],
      ])
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

    describe('zip', () => {
      test('can zip', async ({ expect }) => {
        const streamResult = await as.toArray(as.pipe([1, 2, 3], as.zip(['a', 'b', 'c'])))
        expect(streamResult).toEqual([
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ])
      })

      test('can zip with a smaller generator', async ({ expect }) => {
        const streamResult = await as.toArray(as.pipe([1, 2, 3], as.zip(['a'])))
        expect(streamResult).toEqual([[1, 'a']])
      })

      test('can zip with an async generator', async ({ expect }) => {
        async function* asyncGenerator() {
          yield 'a'
          yield 'b'
          yield 'c'
        }
        const streamResult = await as.toArray(as.pipe([1, 2, 3], as.zip(asyncGenerator())))
        expect(streamResult).toEqual([
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ])
      })
    })

    describe('skip', () => {
      test('can skip values', async ({ expect }) => {
        const streamResult = await as.toArray(as.pipe([1, 2, 3, 4, 5], as.skip(2)))
        expect(streamResult).toEqual([3, 4, 5])
      })

      test('handles negative values', async ({ expect }) => {
        const streamResult = await as.toArray(as.pipe([1, 2, 3, 4, 5], as.skip(-2)))
        expect(streamResult).toEqual([1, 2, 3, 4, 5])
      })
    })

    describe('limit', () => {
      test('can limit values', async ({ expect }) => {
        const streamResult = await as.toArray(as.pipe([1, 2, 3, 4, 5], as.limit(3)))
        expect(streamResult).toEqual([1, 2, 3])
      })

      test('handles negative limits', async ({ expect }) => {
        const streamResult = await as.toArray(as.pipe([1, 2, 3, 4, 5], as.limit(-2)))
        expect(streamResult).toEqual([])
      })
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

    test('can run side effects', async ({ expect }) => {
      const sideEffect = vi.fn(() => Promise.resolve())
      const streamResult = await as.toArray(
        as.pipe(
          [1, 2, 3],
          as.map((x) => x + 1),
          as.onEach(sideEffect),
          as.limit(2),
        ),
      )
      expect(streamResult).toEqual([2, 3])
      expect(sideEffect).toHaveBeenCalledTimes(2)
      expect(sideEffect).toHaveBeenNthCalledWith(1, 2, 0)
      expect(sideEffect).toHaveBeenNthCalledWith(2, 3, 1)
    })
  })

  describe('collectors', () => {
    test('can collect to a set', async ({ expect }) => {
      const streamResult = await as.toSet([1, 2, 2, 3, 3, 3])
      expect(streamResult).toEqual(new Set([1, 2, 3]))
    })

    test('can collect to a map', async ({ expect }) => {
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

    test('can collect to a record', async ({ expect }) => {
      const streamResult = await as.toRecord(
        [1, 2],
        (x) => x.toString(),
        (x) => x,
      )
      expect(streamResult).toEqual({
        '1': 1,
        '2': 2,
      })
    })

    describe('first', () => {
      test('can get the first element', async ({ expect }) => {
        const streamResult = await as.first([1, 2, 3])
        expect(streamResult).toEqual(1)
      })

      test('returns undefined if empty', async ({ expect }) => {
        const streamResult = await as.first([])
        expect(streamResult).toBeUndefined()
      })
    })

    describe('last', () => {
      test('can get the last element', async ({ expect }) => {
        const streamResult = await as.last([1, 2, 3])
        expect(streamResult).toEqual(3)
      })

      test('returns undefined if empty', async ({ expect }) => {
        const streamResult = await as.last([])
        expect(streamResult).toBeUndefined()
      })
    })

    describe('find', () => {
      test('can find an element', async ({ expect }) => {
        const streamResult = await as.find([1, 2, 3, 4, 5], (x) => x % 2 === 0)
        expect(streamResult).toEqual(2)
      })

      test('returns undefined if not found', async ({ expect }) => {
        const streamResult = await as.find([1, 3, 5], (x) => x % 2 === 0)
        expect(streamResult).toBeUndefined()
      })
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

    describe('sum', () => {
      test('can sum', async ({ expect }) => {
        const streamResult = await as.sum(TestUtils.asyncTestStream)
        expect(streamResult).toEqual(TestUtils.expectedSum)
      })

      test('can sum non-numbers', async ({ expect }) => {
        const streamResult = await as.sum(
          as.pipe(['hello', 'world', '!'], as.limit(2)),
          (x) => x.length,
        )
        expect(streamResult).toEqual(10)
      })
    })
  })

  test('can run a callback on each value', async ({ expect }) => {
    const callback = vi.fn()
    await as.forEach([1, 2, 3], callback)
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenNthCalledWith(1, 1, 0)
    expect(callback).toHaveBeenNthCalledWith(2, 2, 1)
    expect(callback).toHaveBeenNthCalledWith(3, 3, 2)
  })
})
