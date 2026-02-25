import { bench, describe } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

describe('toSet', () => {
  bench(
    'streams',
    () => {
      const _result = s.toSet(TestUtils.testStream)
    },
    { time: 1000 },
  )

  bench(
    'streams with Set constructor',
    () => {
      const result = new Set(TestUtils.testStream)
      TestUtils.validateSet(result)
    },
    { time: 1000 },
  )

  bench(
    'for-of',
    () => {
      const result = new Set<number>()
      TestUtils.createTestForOfLoop((item) => {
        result.add(item)
      })
      TestUtils.validateSet(result)
    },
    { time: 1000 },
  )

  bench(
    'for-of with Set constructor',
    () => {
      const intermediate: number[] = []
      TestUtils.createTestForOfLoop((item) => {
        intermediate.push(item)
      })
      const result = new Set(intermediate)
      TestUtils.validateSet(result)
    },
    { time: 1000 },
  )

  bench(
    'for-i',
    () => {
      const result = new Set<number>()
      TestUtils.createTestForILoop((item) => {
        result.add(item)
      })
      TestUtils.validateSet(result)
    },
    { time: 1000 },
  )

  bench(
    'for-i with Set constructor',
    () => {
      const intermediate: number[] = []
      TestUtils.createTestForILoop((item) => {
        intermediate.push(item)
      })
      const result = new Set(intermediate)
      TestUtils.validateSet(result)
    },
    { time: 1000 },
  )
  bench(
    'array',
    () => {
      const result = new Set<number>()
      TestUtils.createTestArray().forEach((item) => {
        result.add(item)
      })
      TestUtils.validateSet(result)
    },
    { time: 1000 },
  )

  bench(
    'array with Set constructor',
    () => {
      const intermediate = TestUtils.createTestArray()
      const result = new Set(intermediate)
      TestUtils.validateSet(result)
    },
    { time: 1000 },
  )
})
