export type AsyncProcessor<Input, Output> = (
  value: Input,
  index: number,
) => Output | Promise<Output>

export type AsyncFilter<Input> = AsyncProcessor<Input, boolean>

export type AsyncOperator<Input, Output> = (source: AsyncIterable<Input>) => AsyncIterable<Output>

export type MaybeAsyncIterable<T> = Iterable<T> | AsyncIterable<T>

function createAsyncIterable<T>(factory: () => AsyncIterableIterator<T>): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator]: factory,
  }
}

function toAsyncIterable<T>(source: MaybeAsyncIterable<T>): AsyncIterable<T> {
  if (Symbol.asyncIterator in source) {
    return source
  }

  return createAsyncIterable(async function* (): AsyncIterableIterator<T> {
    yield* source
  })
}

/**
 * Composes a source iterable with zero or more async stream operators.
 */
export function pipe<T>(source: MaybeAsyncIterable<T>): AsyncIterable<T>
export function pipe<T0, T1>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
): AsyncIterable<T1>
export function pipe<T0, T1, T2>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
): AsyncIterable<T2>
export function pipe<T0, T1, T2, T3>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
): AsyncIterable<T3>
export function pipe<T0, T1, T2, T3, T4>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
): AsyncIterable<T4>
export function pipe<T0, T1, T2, T3, T4, T5>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
): AsyncIterable<T5>
export function pipe<T0, T1, T2, T3, T4, T5, T6>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
): AsyncIterable<T6>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
): AsyncIterable<T7>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
): AsyncIterable<T8>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
): AsyncIterable<T9>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
): AsyncIterable<T10>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
): AsyncIterable<T11>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
): AsyncIterable<T12>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
  op13: AsyncOperator<T12, T13>,
): AsyncIterable<T13>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
  op13: AsyncOperator<T12, T13>,
  op14: AsyncOperator<T13, T14>,
): AsyncIterable<T14>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
  op13: AsyncOperator<T12, T13>,
  op14: AsyncOperator<T13, T14>,
  op15: AsyncOperator<T14, T15>,
): AsyncIterable<T15>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
  op13: AsyncOperator<T12, T13>,
  op14: AsyncOperator<T13, T14>,
  op15: AsyncOperator<T14, T15>,
  op16: AsyncOperator<T15, T16>,
): AsyncIterable<T16>
export function pipe<
  T0,
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  T17,
>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
  op13: AsyncOperator<T12, T13>,
  op14: AsyncOperator<T13, T14>,
  op15: AsyncOperator<T14, T15>,
  op16: AsyncOperator<T15, T16>,
  op17: AsyncOperator<T16, T17>,
): AsyncIterable<T17>
export function pipe<
  T0,
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  T17,
  T18,
>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
  op13: AsyncOperator<T12, T13>,
  op14: AsyncOperator<T13, T14>,
  op15: AsyncOperator<T14, T15>,
  op16: AsyncOperator<T15, T16>,
  op17: AsyncOperator<T16, T17>,
  op18: AsyncOperator<T17, T18>,
): AsyncIterable<T18>
export function pipe<
  T0,
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  T17,
  T18,
  T19,
>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
  op13: AsyncOperator<T12, T13>,
  op14: AsyncOperator<T13, T14>,
  op15: AsyncOperator<T14, T15>,
  op16: AsyncOperator<T15, T16>,
  op17: AsyncOperator<T16, T17>,
  op18: AsyncOperator<T17, T18>,
  op19: AsyncOperator<T18, T19>,
): AsyncIterable<T19>
export function pipe<
  T0,
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  T17,
  T18,
  T19,
  T20,
>(
  source: MaybeAsyncIterable<T0>,
  op1: AsyncOperator<T0, T1>,
  op2: AsyncOperator<T1, T2>,
  op3: AsyncOperator<T2, T3>,
  op4: AsyncOperator<T3, T4>,
  op5: AsyncOperator<T4, T5>,
  op6: AsyncOperator<T5, T6>,
  op7: AsyncOperator<T6, T7>,
  op8: AsyncOperator<T7, T8>,
  op9: AsyncOperator<T8, T9>,
  op10: AsyncOperator<T9, T10>,
  op11: AsyncOperator<T10, T11>,
  op12: AsyncOperator<T11, T12>,
  op13: AsyncOperator<T12, T13>,
  op14: AsyncOperator<T13, T14>,
  op15: AsyncOperator<T14, T15>,
  op16: AsyncOperator<T15, T16>,
  op17: AsyncOperator<T16, T17>,
  op18: AsyncOperator<T17, T18>,
  op19: AsyncOperator<T18, T19>,
  op20: AsyncOperator<T19, T20>,
): AsyncIterable<T20>
export function pipe(
  source: MaybeAsyncIterable<any>,
  ...operators: AsyncOperator<any, any>[]
): AsyncIterable<any> {
  let result: AsyncIterable<any> = toAsyncIterable(source)
  for (const operator of operators as readonly AsyncOperator<any, any>[]) {
    result = operator(result)
  }
  return result
}

/**
 * Creates an async iterable over object entries using string and number keys.
 */
export function fromObject<T>(source: Record<string | number, T>): AsyncIterable<[string, T]> {
  return toAsyncIterable(Object.entries(source))
}

/**
 * Projects each input item into a new value.
 */
export function map<Input, Output>(
  fn: AsyncProcessor<Input, Output>,
): AsyncOperator<Input, Output> {
  return (source: AsyncIterable<Input>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<Output> {
      let index = 0
      for await (const item of source) {
        yield fn(item, index++)
      }
    })
}

/**
 * Projects each input item into an iterable and flattens it one level.
 */
export function flatMap<Input, Output>(
  fn: (
    value: Input,
    index: number,
  ) => MaybeAsyncIterable<Output> | Promise<MaybeAsyncIterable<Output>>,
): AsyncOperator<Input, Output> {
  return (source: AsyncIterable<Input>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<Output> {
      let index = 0
      for await (const item of source) {
        yield* toAsyncIterable(await fn(item, index++))
      }
    })
}

/**
 * Combines each item with the corresponding item from another iterable.
 */
export function zip<T, R>(other: MaybeAsyncIterable<R>): AsyncOperator<T, [T, R]> {
  return (source: AsyncIterable<T>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<[T, R]> {
      const otherIterator =
        Symbol.asyncIterator in other ? other[Symbol.asyncIterator]() : other[Symbol.iterator]()

      for await (const item of source) {
        const otherItem = await otherIterator.next()
        if (otherItem.done) {
          break
        }
        yield [item, otherItem.value]
      }
    })
}

/**
 * Emits at most the first n items from the source.
 */
export function limit<T>(n: number): AsyncOperator<T, T> {
  return (source: AsyncIterable<T>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<T> {
      if (n <= 0) {
        return
      }
      let count = 0
      for await (const item of source) {
        yield item
        if (++count >= n) {
          break
        }
      }
    })
}

/**
 * Emits only the items matching the predicate.
 */
export function filter<T, S extends T>(
  fn: (value: T, index: number) => value is S,
): AsyncOperator<T, S>
/**
 * Emits only the items matching the predicate.
 */
export function filter<T>(fn: AsyncFilter<T>): AsyncOperator<T, T>
export function filter<T>(fn: AsyncFilter<T>): AsyncOperator<T, T> {
  return (source: AsyncIterable<T>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<T> {
      let index = 0
      for await (const item of source) {
        if (await fn(item, index++)) {
          yield item
        }
      }
    })
}

/**
 * Emits only non-null and non-undefined values.
 */
export function filterDefined<T>(): AsyncOperator<T, NonNullable<T>> {
  return filter<T, NonNullable<T>>(
    (item): item is NonNullable<T> => item !== null && item !== undefined,
  )
}

/**
 * Emits only the first occurrence of each unique value.
 */
export function distinct<T>(): AsyncOperator<T, T> {
  return (source: AsyncIterable<T>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<T> {
      const seen = new Set<T>()
      for await (const item of source) {
        if (seen.has(item)) {
          continue
        }
        seen.add(item)
        yield item
      }
    })
}

/**
 * Appends one or more iterables after the source iterable.
 */
export function append<T>(...sources: MaybeAsyncIterable<T>[]): AsyncOperator<T, T> {
  return (source: AsyncIterable<T>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<T> {
      yield* source
      for (const other of sources) {
        yield* toAsyncIterable(other)
      }
    })
}

/**
 * Caches produced values so future iterations replay without re-reading the source.
 */
export function cache<T>(): AsyncOperator<T, T> {
  return (source: AsyncIterable<T>) => {
    let cachedInput: T[] | undefined
    return createAsyncIterable(async function* (): AsyncIterableIterator<T> {
      if (cachedInput) {
        yield* cachedInput
        return
      }

      const cacheBuffer: T[] = []
      for await (const item of source) {
        cacheBuffer.push(item)
        yield item
      }
      cachedInput = cacheBuffer
    })
  }
}

/**
 * Collects all values into a set.
 */
export async function toSet<T>(source: MaybeAsyncIterable<T>): Promise<Set<T>> {
  const result = new Set<T>()
  for await (const item of source) {
    result.add(item)
  }
  return result
}

/**
 * Collects all values into an array.
 */
export async function toArray<T>(source: MaybeAsyncIterable<T>): Promise<T[]> {
  const result: T[] = []
  for await (const item of source) {
    result.push(item)
  }
  return result
}

/**
 * Collects values into a map using key and value projections.
 */
export async function toMap<T, K, U>(
  source: MaybeAsyncIterable<T>,
  key: AsyncProcessor<T, K>,
  value: AsyncProcessor<T, U>,
): Promise<Map<K, U>> {
  let index = 0
  const result = new Map<K, U>()
  for await (const item of source) {
    result.set(await key(item, index), await value(item, index))
    index++
  }
  return result
}

/**
 * Collects values into a record using key and value projections.
 */
export async function toRecord<T, U>(
  source: MaybeAsyncIterable<T>,
  key: AsyncProcessor<T, string>,
  value: AsyncProcessor<T, U>,
): Promise<Record<string, U>> {
  const result: Record<string, U> = {}
  let index = 0
  for await (const item of source) {
    result[await key(item, index)] = await value(item, index)
    index++
  }
  return result
}

/**
 * Reduces all values into a single accumulated result.
 */
export async function reduce<T, R>(
  source: MaybeAsyncIterable<T>,
  fn: (acc: R, value: T, index: number) => R | Promise<R>,
  initialValue: R | Promise<R>,
): Promise<R> {
  let acc = await initialValue
  let index = 0
  for await (const item of source) {
    acc = await fn(acc, item, index++)
  }
  return acc
}

/**
 * Sums numeric values from a source.
 */
export async function sum(source: MaybeAsyncIterable<number>): Promise<number>
/**
 * Sums projected numeric values from a source.
 */
export async function sum<T>(
  source: MaybeAsyncIterable<T>,
  fn: T extends number ? never : AsyncProcessor<T, number>,
): Promise<number>
export async function sum<T>(
  source: MaybeAsyncIterable<T>,
  fn?: AsyncProcessor<T, number>,
): Promise<number> {
  return fn
    ? reduce(source, async (acc, value, index) => acc + (await fn(value, index)), 0)
    : reduce(source as MaybeAsyncIterable<number>, (acc, value) => acc + value, 0)
}

/**
 * Executes a callback for each item and returns the original source.
 */
export async function forEach<T>(
  source: MaybeAsyncIterable<T>,
  fn: AsyncProcessor<T, void>,
): Promise<AsyncIterable<T>> {
  let index = 0
  for await (const item of source) {
    await fn(item, index++)
  }
  return toAsyncIterable(source)
}

/**
 * Returns the first item matching the predicate.
 */
export async function find<T>(
  source: MaybeAsyncIterable<T>,
  fn: AsyncFilter<T>,
): Promise<T | undefined> {
  let index = 0
  for await (const item of source) {
    if (await fn(item, index++)) {
      return item
    }
  }
  return undefined
}

/**
 * Returns true if at least one item matches the predicate.
 */
export async function some<T>(source: MaybeAsyncIterable<T>, fn: AsyncFilter<T>): Promise<boolean> {
  let index = 0
  for await (const item of source) {
    if (await fn(item, index++)) {
      return true
    }
  }
  return false
}

/**
 * Returns true if all items match the predicate.
 */
export async function every<T>(
  source: MaybeAsyncIterable<T>,
  fn: AsyncFilter<T>,
): Promise<boolean> {
  let index = 0
  for await (const item of source) {
    if (!(await fn(item, index++))) {
      return false
    }
  }
  return true
}

/**
 * Joins string or number values with a separator.
 */
export function join<T extends string | number>(
  source: MaybeAsyncIterable<T>,
  separator: string,
): Promise<string> {
  let index = 0
  return reduce(source, (acc, value) => `${acc}${index++ === 0 ? '' : separator}${value}`, '')
}
