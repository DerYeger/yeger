import * as as from '../src/async'
import * as s from '../src/sync'

function fibonacci(n: number): number {
  if (n <= 1) {
    return 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

const TEST_LIMIT = 10

const source = Array.from({ length: 10000 }, (_, i) => i)

const testStream = s.pipe(
  source,
  s.filter((x) => x % 2 !== 0),
  s.map((x) => x * 2),
  s.map((x) => `${x}.5`),
  s.map((x) => Number.parseInt(x, 10)),
  s.map((x) => x % 20),
  s.map((x) => fibonacci(x)),
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
  as.limit(TEST_LIMIT),
)

const earlyLimitTestStream = s.pipe(
  source,
  s.filter((x) => x % 2 !== 0),
  s.limit(TEST_LIMIT),
  s.map((x) => x * 2),
  s.map((x) => `${x}.5`),
  s.map((x) => Number.parseInt(x, 10)),
  s.map((x) => x % 20),
  s.map((x) => fibonacci(x)),
)

export const TestUtils = {
  asyncTestStream,
  earlyLimitTestStream,
  fibonacci,
  limit: TEST_LIMIT,
  TEST_LIMIT,
  source,
  testStream,
}
