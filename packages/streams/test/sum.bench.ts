import { test } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

test('sum', async ({ bench }) => {
  await bench.compare(
    bench('streams', () => {
      const result = s.sum(TestUtils.testStream)
      TestUtils.validateSum(result)
    }),

    bench('for-of', () => {
      let result = 0
      TestUtils.createTestForOfLoop((item) => {
        result += item
      })
      TestUtils.validateSum(result)
    }),

    bench('for-i', () => {
      let result = 0
      TestUtils.createTestForILoop((item) => {
        result += item
      })
      TestUtils.validateSum(result)
    }),

    bench('array', () => {
      let result = 0
      TestUtils.createTestArray().forEach((item) => {
        result += item
      })
      TestUtils.validateSum(result)
    }),

    bench('array with reduce', () => {
      const result = TestUtils.createTestArray().reduce((a, b) => a + b, 0)
      TestUtils.validateSum(result)
    }),
  )
})
