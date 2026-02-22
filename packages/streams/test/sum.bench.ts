import { bench } from 'vitest'

import * as s from '../src/sync'
import { TestUtils } from './test-utils'

bench(
  'streams',
  () => {
    s.sum(TestUtils.testStream)
  },
  { time: 1000 },
)

bench(
  'streams with early limit',
  () => {
    s.sum(TestUtils.earlyLimitTestStream)
  },
  { time: 1000 },
)

bench(
  'for-of',
  () => {
    let count = 0
    let _result = 0
    for (const item of TestUtils.source) {
      if (item % 2 === 0) {
        continue
      }
      _result += TestUtils.fibonacci(Number.parseInt(`${item * 2}.5`) % 20)
      if (++count === TestUtils.limit) {
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
      .reduce((a, b) => a + b, 0)
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
      .reduce((a, b) => a + b, 0)
  },
  { time: 1000 },
)
