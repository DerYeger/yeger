import { bench, describe } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

describe('toRecord', () => {
  bench(
    'streams',
    () => {
      const result = s.toRecord(
        TestUtils.testStream,
        (x) => x.toString(),
        (x) => x,
      )
      TestUtils.validateRecord(result)
    },
    { time: 1000 },
  )

  bench(
    'streams with Object.fromEntries',
    () => {
      const result = Object.fromEntries(
        s.pipe(
          TestUtils.testStream,
          s.map((x) => [x.toString(), x]),
        ),
      )
      TestUtils.validateRecord(result)
    },
    { time: 1000 },
  )

  bench(
    'for-of',
    () => {
      const result: Record<string, number> = {}
      TestUtils.createTestForOfLoop((item) => {
        result[item.toString()] = item
      })
      TestUtils.validateRecord(result)
    },
    { time: 1000 },
  )

  bench(
    'for-of with Object.fromEntries',
    () => {
      const intermediate: [string, number][] = []
      TestUtils.createTestForOfLoop((item) => {
        intermediate.push([item.toString(), item])
      })
      const result = Object.fromEntries(intermediate)
      TestUtils.validateRecord(result)
    },
    { time: 1000 },
  )

  bench(
    'for-i',
    () => {
      const result: Record<string, number> = {}
      TestUtils.createTestForILoop((item) => {
        result[item.toString()] = item
      })
      TestUtils.validateRecord(result)
    },
    { time: 1000 },
  )

  bench(
    'for-i with Object.fromEntries',
    () => {
      const intermediate: [string, number][] = []
      TestUtils.createTestForILoop((item) => {
        intermediate.push([item.toString(), item])
      })
      const result = Object.fromEntries(intermediate)
      TestUtils.validateRecord(result)
    },
    { time: 1000 },
  )

  bench(
    'array',
    () => {
      const result: Record<string, number> = {}
      TestUtils.createTestArray().forEach((item) => {
        result[item.toString()] = item
      })
      TestUtils.validateRecord(result)
    },
    { time: 1000 },
  )

  bench(
    'array with Object.fromEntries',
    () => {
      const result = Object.fromEntries(TestUtils.createTestArray().map((x) => [x.toString(), x]))
      TestUtils.validateRecord(result)
    },
    { time: 1000 },
  )
})
