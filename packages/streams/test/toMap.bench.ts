import { bench } from 'vitest'

import { TestUtils } from './test-utils'

bench(
  'streams',
  () => {
    TestUtils.testStream.toMap((x) => x.toString())
  },
  { time: 1000 },
)

bench(
  'streams with early limit',
  () => {
    TestUtils.earlyLimitTestStream.toMap((x) => x.toString())
  },
  { time: 1000 },
)

bench(
  'for-of',
  () => {
    const result = new Map<string, number>()
    for (const item of TestUtils.source) {
      if (item % 2 === 0) {
        continue
      }
      const value = TestUtils.fibonacci(Number.parseInt(`${item * 2}.5`) % 20)
      result.set(value.toString(), value)
      if (result.size === 1000) {
        break
      }
    }
  },
  { time: 1000 },
)

bench(
  'for-of intermediate',
  () => {
    const intermediate: [string, number][] = []
    for (const item of TestUtils.source) {
      if (item % 2 === 0) {
        continue
      }
      const value = TestUtils.fibonacci(Number.parseInt(`${item * 2}.5`) % 20)
      intermediate.push([value.toString(), value])
      if (intermediate.length === 1000) {
        break
      }
    }
    // @ts-expect-error Unused
    const _result = new Map(intermediate)
  },
  { time: 1000 },
)

bench(
  'array',
  () => {
    // @ts-expect-error Unused
    const _result = new Map(
      TestUtils.source
        .filter((x) => x % 2 !== 0)
        .map((x) => x * 2)
        .map((x) => `${x}.5`)
        .map((x) => Number.parseInt(x, 10))
        .map((x) => x % 20)
        .map(TestUtils.fibonacci)
        .slice(0, TestUtils.limit)
        .map((x) => [x.toString(), x]),
    )
  },
  { time: 1000 },
)

bench(
  'array with early limit',
  () => {
    // @ts-expect-error Unused
    const _result = new Map(
      TestUtils.source
        .filter((x) => x % 2 !== 0)
        .slice(0, TestUtils.limit)
        .map((x) => x * 2)
        .map((x) => `${x}.5`)
        .map((x) => Number.parseInt(x, 10))
        .map((x) => x % 20)
        .map(TestUtils.fibonacci)
        .map((x) => [x.toString(), x]),
    )
  },
  { time: 1000 },
)
