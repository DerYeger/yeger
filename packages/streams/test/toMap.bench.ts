import { bench, describe } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

describe('toMap', () => {
  bench(
    'streams',
    () => {
      const result = s.toMap(
        TestUtils.testStream,
        (x) => x.toString(),
        (x) => x,
      )
      TestUtils.validateMap(result)
    },
    { time: 1000 },
  )

  bench(
    'streams with Map constructor',
    () => {
      const result = new Map(
        s.pipe(
          TestUtils.testStream,
          s.map((x) => [x.toString(), x]),
        ),
      )
      TestUtils.validateMap(result)
    },
    { time: 1000 },
  )

  bench(
    'for-of',
    () => {
      const result = new Map<string, number>()
      TestUtils.createTestForOfLoop((item) => {
        result.set(item.toString(), item)
      })
      TestUtils.validateMap(result)
    },
    { time: 1000 },
  )

  bench(
    'for-of with Map constructor',
    () => {
      const intermediate: [string, number][] = []
      TestUtils.createTestForOfLoop((item) => {
        intermediate.push([item.toString(), item])
      })
      const result = new Map(intermediate)
      TestUtils.validateMap(result)
    },
    { time: 1000 },
  )

  bench(
    'for-i',
    () => {
      const result = new Map<string, number>()
      TestUtils.createTestForILoop((item) => {
        result.set(item.toString(), item)
      })
      TestUtils.validateMap(result)
    },
    { time: 1000 },
  )

  bench(
    'for-i with Map constructor',
    () => {
      const intermediate: [string, number][] = []
      TestUtils.createTestForILoop((item) => {
        intermediate.push([item.toString(), item])
      })
      const result = new Map(intermediate)
      TestUtils.validateMap(result)
    },
    { time: 1000 },
  )

  bench(
    'array',
    () => {
      const result = new Map<string, number>()
      TestUtils.createTestArray().forEach((item) => {
        result.set(item.toString(), item)
      })
      TestUtils.validateMap(result)
    },
    { time: 1000 },
  )

  bench(
    'array with Map constructor',
    () => {
      const result = new Map<string, number>(
        TestUtils.createTestArray().map((x) => [x.toString(), x]),
      )
      TestUtils.validateMap(result)
    },
    { time: 1000 },
  )
})
