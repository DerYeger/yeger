import { describe, test, vi } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

describe('sync streams', () => {
  describe('sources', () => {
    test('can be empty', ({ expect }) => {
      const streamResult = s.toArray([])
      expect(streamResult).toEqual([])
    })

    test('can have a single value', ({ expect }) => {
      const streamResult = s.toArray([1])
      expect(streamResult).toEqual([1])
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
  })

  describe('operators', () => {
    test('can pipe', ({ expect }) => {
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

    test('can filter defined', ({ expect }) => {
      const res = s.toArray(s.pipe([1, null, 2, undefined, 3], s.filterDefined()))
      expect(res).toEqual([1, 2, 3])
    })

    test('can filter truthy', ({ expect }) => {
      const res = s.toArray(s.pipe([0, 1, '', 'hello', false, true], s.filterTruthy()))
      expect(res).toEqual([1, 'hello', true])
    })

    test('can map', ({ expect }) => {
      const res = s.pipe(
        [false, 0, 'test'],
        s.map((value, index) => [value, index]),
      )
      expect(s.toArray(res)).toEqual([
        [false, 0],
        [0, 1],
        ['test', 2],
      ])
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

    describe('zip', () => {
      test('can zip', ({ expect }) => {
        const streamResult = s.toArray(s.pipe([1, 2, 3], s.zip(['a', 'b', 'c'])))
        expect(streamResult).toEqual([
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ])
      })

      test('can zip with a smaller generator', ({ expect }) => {
        const streamResult = s.toArray(s.pipe([1, 2, 3], s.zip(['a'])))
        expect(streamResult).toEqual([[1, 'a']])
      })
    })

    describe('skip', () => {
      test('can skip values', ({ expect }) => {
        const streamResult = s.toArray(s.pipe([1, 2, 3, 4, 5], s.skip(2)))
        expect(streamResult).toEqual([3, 4, 5])
      })

      test('handles negative values', ({ expect }) => {
        const streamResult = s.toArray(s.pipe([1, 2, 3, 4, 5], s.skip(-2)))
        expect(streamResult).toEqual([1, 2, 3, 4, 5])
      })
    })

    describe('limit', () => {
      test('can limit values', ({ expect }) => {
        const streamResult = s.toArray(s.pipe([1, 2, 3, 4, 5], s.limit(3)))
        expect(streamResult).toEqual([1, 2, 3])
      })

      test('handles negative limits', ({ expect }) => {
        const streamResult = s.toArray(s.pipe([1, 2, 3, 4, 5], s.limit(-2)))
        expect(streamResult).toEqual([])
      })
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

    test('can run side effects', ({ expect }) => {
      const sideEffect = vi.fn()
      const streamResult = s.toArray(
        s.pipe(
          [1, 2, 3],
          s.map((x) => x + 1),
          s.onEach(sideEffect),
          s.limit(2),
        ),
      )
      expect(streamResult).toEqual([2, 3])
      expect(sideEffect).toHaveBeenCalledTimes(2)
      expect(sideEffect).toHaveBeenNthCalledWith(1, 2, 0)
      expect(sideEffect).toHaveBeenNthCalledWith(2, 3, 1)
    })
  })

  describe('collectors', () => {
    test('can collect to a set', ({ expect }) => {
      const streamResult = s.toSet([1, 2, 2, 3, 3, 3])
      expect(streamResult).toEqual(new Set([1, 2, 3]))
    })

    test('can collect to a map', ({ expect }) => {
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

    test('can collect to a record', ({ expect }) => {
      const streamResult = s.toRecord(
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
      test('can get the first element', ({ expect }) => {
        const streamResult = s.first([1, 2, 3])
        expect(streamResult).toEqual(1)
      })

      test('returns undefined if empty', ({ expect }) => {
        const streamResult = s.first([])
        expect(streamResult).toBeUndefined()
      })
    })

    describe('last', () => {
      test('can get the last element', ({ expect }) => {
        const streamResult = s.last([1, 2, 3])
        expect(streamResult).toEqual(3)
      })

      test('returns undefined if empty', ({ expect }) => {
        const streamResult = s.last([])
        expect(streamResult).toBeUndefined()
      })
    })

    describe('find', () => {
      test('can find an element', ({ expect }) => {
        const streamResult = s.find([1, 2, 3, 4, 5], (x) => x % 2 === 0)
        expect(streamResult).toEqual(2)
      })

      test('returns undefined if not found', ({ expect }) => {
        const streamResult = s.find([1, 3, 5], (x) => x % 2 === 0)
        expect(streamResult).toBeUndefined()
      })
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

    describe('sum', () => {
      test('can sum', ({ expect }) => {
        const streamResult = s.sum(TestUtils.testStream)
        expect(streamResult).toEqual(TestUtils.expectedSum)
      })

      test('can sum non-numbers', ({ expect }) => {
        const streamResult = s.sum(s.pipe([1, 2, 3], s.limit(2)), (x) => x * 2)
        expect(streamResult).toEqual(6)
      })
    })
  })

  test('can run a callback on each value', ({ expect }) => {
    const callback = vi.fn()
    s.forEach([1, 2, 3], callback)
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenNthCalledWith(1, 1, 0)
    expect(callback).toHaveBeenNthCalledWith(2, 2, 1)
    expect(callback).toHaveBeenNthCalledWith(3, 3, 2)
  })
})
