import { bench } from 'vitest'

import { TestUtils } from './test-utils'

bench(
  'streams',
  () => {
    TestUtils.testStream.toSet()
  },
  { time: 1000 },
)

bench(
  'streams with intermediate array',
  () => {
    // @ts-expect-error Unused
    const _result = new Set(TestUtils.testStream.toArray())
  },
  { time: 1000 },
)

bench(
  'streams with early limit',
  () => {
    TestUtils.earlyLimitTestStream.toSet()
  },
  { time: 1000 },
)

bench(
  'for-of',
  () => {
    const result = new Set<number>()
    for (const item of TestUtils.source) {
      if (item % 2 === 0) {
        continue
      }
      result.add(TestUtils.fibonacci(Number.parseInt(`${item * 2}.0`) % 20))
      if (result.size === 100) {
        break
      }
    }
  },
  { time: 1000 },
)

bench(
  'for-of intermediate',
  () => {
    const result: number[] = []
    for (const item of TestUtils.source) {
      if (item % 2 === 0) {
        continue
      }
      result.push(TestUtils.fibonacci(Number.parseInt(`${item * 2}.5`) % 20))
      if (result.length === 1000) {
        break
      }
    }
    // @ts-expect-error Unused
    const _set = new Set(result)
  },
  { time: 1000 },
)

bench(
  'array',
  () => {
    const result = TestUtils.source
      .filter((x) => x % 2 !== 0)
      .map((x) => x * 2)
      .map((x) => `${x}.5`)
      .map((x) => Number.parseInt(x, 10))
      .map((x) => x % 20)
      .map(TestUtils.fibonacci)
      .slice(0, TestUtils.limit)
    // @ts-expect-error Unused
    const _set = new Set(result)
  },
  { time: 1000 },
)

bench(
  'array with early limit',
  () => {
    const result = TestUtils.source
      .filter((x) => x % 2 !== 0)
      .slice(0, TestUtils.limit)
      .map((x) => x * 2)
      .map((x) => `${x}.5`)
      .map((x) => Number.parseInt(x, 10))
      .map((x) => x % 20)
      .map(TestUtils.fibonacci)
    // @ts-expect-error Unused
    const _set = new Set(result)
  },
  { time: 1000 },
)
