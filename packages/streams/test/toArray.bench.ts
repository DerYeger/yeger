import { bench, describe } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

describe('toArray', () => {
  bench(
    'streams',
    () => {
      const result = s.toArray(TestUtils.testStream)
      TestUtils.validateArray(result)
    },
    { time: 1000 },
  )

  bench(
    'for-of',
    () => {
      const result: number[] = []
      TestUtils.createTestForOfLoop((item) => {
        result.push(item)
      })
      TestUtils.validateArray(result)
    },
    { time: 1000 },
  )

  bench(
    'for-i',
    () => {
      const result: number[] = []
      TestUtils.createTestForILoop((item) => {
        result.push(item)
      })
      TestUtils.validateArray(result)
    },
    { time: 1000 },
  )

  bench(
    'array',
    () => {
      const result = TestUtils.createTestArray()
      TestUtils.validateArray(result)
    },
    { time: 1000 },
  )
})
