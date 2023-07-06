import { bench } from 'vitest'

import { TestUtils } from '~test/test-utils'

bench(
  'streams',
  () => {
    TestUtils.testStream.toArray()
  },
  { time: 1000 },
)

bench(
  'streams with early limit',
  () => {
    TestUtils.earlyLimitTestStream.toArray()
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
