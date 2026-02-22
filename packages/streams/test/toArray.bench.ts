import { bench } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

bench(
  'streams',
  () => {
    s.toArray(TestUtils.testStream)
  },
  { time: 1000 },
)

bench(
  'streams with early limit',
  () => {
    s.toArray(TestUtils.earlyLimitTestStream)
  },
  { time: 1000 },
)

bench(
  'for-of',
  () => {
    const result = []
    for (const item of TestUtils.source) {
      if (item % 2 === 0) {
        continue
      }
      result.push(TestUtils.fibonacci(Number.parseInt(`${item * 2}.5`) % 20))
      if (result.length === 1000) {
        break
      }
    }
  },
  { time: 1000 },
)

bench(
  'array',
  () => {
    TestUtils.source
      .filter((x) => x % 2 !== 0)
      .map((x) => x * 2)
      .map((x) => `${x}.5`)
      .map((x) => Number.parseInt(x, 10))
      .map((x) => x % 20)
      .map(TestUtils.fibonacci)
      .slice(0, TestUtils.limit)
  },
  { time: 1000 },
)

bench(
  'array with early limit',
  () => {
    TestUtils.source
      .filter((x) => x % 2 !== 0)
      .slice(0, TestUtils.limit)
      .map((x) => x * 2)
      .map((x) => `${x}.5`)
      .map((x) => Number.parseInt(x, 10))
      .map((x) => x % 20)
      .map(TestUtils.fibonacci)
  },
  { time: 1000 },
)
