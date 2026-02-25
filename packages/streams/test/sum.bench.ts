import { bench, describe } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

describe('sum', () => {
  bench(
    'streams',
    () => {
      const result = s.sum(TestUtils.testStream)
      TestUtils.validateSum(result)
    },
    { time: 1000 },
  )

  bench(
    'for-of',
    () => {
      let result = 0
      TestUtils.createTestForOfLoop((item) => {
        result += item
      })
      TestUtils.validateSum(result)
    },
    { time: 1000 },
  )

  bench(
    'for-i',
    () => {
      let result = 0
      TestUtils.createTestForILoop((item) => {
        result += item
      })
      TestUtils.validateSum(result)
    },
    { time: 1000 },
  )

  bench(
    'array',
    () => {
      let result = 0
      TestUtils.createTestArray().forEach((item) => {
        result += item
      })
      TestUtils.validateSum(result)
    },
    { time: 1000 },
  )

  bench(
    'array with reduce',
    () => {
      const result = TestUtils.createTestArray().reduce((a, b) => a + b, 0)
      TestUtils.validateSum(result)
    },
    { time: 1000 },
  )
})
