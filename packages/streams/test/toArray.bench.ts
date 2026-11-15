import { test } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

test('toArray', async ({ bench }) => {
  await bench.compare(
    bench('streams', () => {
      const result = s.toArray(TestUtils.testStream)
      TestUtils.validateArray(result)
    }),

    bench('for-of', () => {
      const result: number[] = []
      TestUtils.createTestForOfLoop((item) => {
        result.push(item)
      })
      TestUtils.validateArray(result)
    }),

    bench('for-i', () => {
      const result: number[] = []
      TestUtils.createTestForILoop((item) => {
        result.push(item)
      })
      TestUtils.validateArray(result)
    }),

    bench('array', () => {
      const result = TestUtils.createTestArray()
      TestUtils.validateArray(result)
    }),
  )
})
