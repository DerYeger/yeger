import { Stream } from '~/index'

function fibonacci(n: number): number {
  if (n <= 1) {
    return 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

const limit = 10

const source = Array.from({ length: 10000 }, (_, i) => i)

const testStream = Stream.from(source)
  .filter((x) => x % 2 !== 0)
  .map((x) => x * 2)
  .map((x) => `${x}.5`)
  .map((x) => Number.parseInt(x, 10))
  .map((x) => x % 20)
  .map((x) => fibonacci(x))
  .limit(limit)

const earlyLimitTestStream = Stream.from(source)
  .filter((x) => x % 2 !== 0)
  .limit(limit)
  .map((x) => x * 2)
  .map((x) => `${x}.5`)
  .map((x) => Number.parseInt(x, 10))
  .map((x) => x % 20)
  .map((x) => fibonacci(x))

export const TestUtils = {
  fibonacci,
  source,
  testStream,
  earlyLimitTestStream,
  limit,
}
