import * as as from '../src/async'
import * as s from '../src/sync'

function fibonacci(n: number): number {
  if (n <= 1) {
    return 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

const TEST_LIMIT = 1000

const source = Array.from({ length: 100000 }, (_, i) => i)

const testStream = s.pipe(
  source,
  s.filter((x) => x % 2 !== 0),
  s.map((x) => x * 2),
  s.map((x) => `${x}.5`),
  s.map((x) => Number.parseInt(x, 10)),
  s.map((x) => x % 20),
  s.map((x) => fibonacci(x)),
  s.map((x) => Math.floor(x / 42)),
  s.flatMap((x) => [x - 1, x, 2 * x]),
  s.limit(TEST_LIMIT),
)

const asyncTestStream = as.pipe(
  source,
  as.filter((x) => x % 2 !== 0),
  as.map((x) => x * 2),
  as.map((x) => `${x}.5`),
  as.map((x) => Number.parseInt(x, 10)),
  as.map((x) => x % 20),
  as.map((x) => fibonacci(x)),
  as.map((x) => Math.floor(x / 42)),
  as.flatMap((x) => [x - 1, x, 2 * x]),
  as.limit(TEST_LIMIT),
)

function createTestArray() {
  return TestUtils.source
    .filter((x) => x % 2 !== 0)
    .map((x) => x * 2)
    .map((x) => `${x}.5`)
    .map((x) => Number.parseInt(x, 10))
    .map((x) => x % 20)
    .map(TestUtils.fibonacci)
    .map((x) => Math.floor(x / 42))
    .flatMap((x) => [x - 1, x, 2 * x])
    .slice(0, TEST_LIMIT)
}

function createTestForOfLoop(onItem: (value: number) => void) {
  let count = 0
  for (const item of source) {
    if (item % 2 === 0) {
      continue
    }
    const lastValueBeforeFlatMap = Math.floor(
      TestUtils.fibonacci(Number.parseInt(`${item * 2}.5`) % 20) / 42,
    )
    onItem(lastValueBeforeFlatMap - 1)
    count += 1
    if (count === TestUtils.limit) {
      break
    }

    onItem(lastValueBeforeFlatMap)
    count += 1
    if (count === TestUtils.limit) {
      break
    }

    onItem(2 * lastValueBeforeFlatMap)
    count += 1
    if (count === TestUtils.limit) {
      break
    }
  }
}

function createTestForILoop(onItem: (value: number) => void) {
  let count = 0
  for (let i = 0; i < TestUtils.source.length; i++) {
    const item = TestUtils.source[i]!
    if (item % 2 === 0) {
      continue
    }
    const lastValueBeforeFlatMap = Math.floor(
      TestUtils.fibonacci(Number.parseInt(`${item * 2}.5`) % 20) / 42,
    )
    onItem(lastValueBeforeFlatMap - 1)
    count += 1
    if (count === TestUtils.limit) {
      break
    }

    onItem(lastValueBeforeFlatMap)
    count += 1
    if (count === TestUtils.limit) {
      break
    }

    onItem(2 * lastValueBeforeFlatMap)
    count += 1
    if (count === TestUtils.limit) {
      break
    }
  }
}

const expectedSum = 30048
const expectedSetSize = 11
const expectedArraySize = TEST_LIMIT

function validateArray(result: number[]) {
  if (result.length !== expectedArraySize) {
    console.error(`Expected array size to be ${expectedArraySize}, but got ${result.length}`)
    process.exit(1)
  }
}

function validateMap<K, V>(result: Map<K, V>) {
  if (result.size !== expectedSetSize) {
    console.error(`Expected map size to be ${expectedSetSize}, but got ${result.size}`)
    process.exit(1)
  }
}

function validateSet(result: Set<number>) {
  if (result.size !== expectedSetSize) {
    console.error(`Expected set size to be ${expectedSetSize}, but got ${result.size}`)
    process.exit(1)
  }
}

function validateSum(result: number) {
  if (result !== expectedSum) {
    console.error(`Expected sum to be ${expectedSum}, but got ${result}`)
    process.exit(1)
  }
}

export const TestUtils = {
  asyncTestStream,
  createTestArray,
  createTestForOfLoop,
  createTestForILoop,
  expectedSum,
  fibonacci,
  limit: TEST_LIMIT,
  source,
  testStream,
  validateArray,
  validateMap,
  validateSet,
  validateSum,
}
