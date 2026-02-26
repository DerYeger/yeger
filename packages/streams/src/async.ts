/**
 * An async callback function that processes an input value and produces an output value.
 * @template Input The type of the input value.
 * @template Output The type of the output value.
 * @param value The input value to process.
 * @param index The zero-based index of the input value in the source iterable.
 * @returns The processed output value.
 */
export type AsyncProcessor<Input, Output> = (
  value: Input,
  index: number,
) => Output | Promise<Output>

/**
 * A {@link AsyncProcessor} that produces a boolean output to indicate whether an input value matches a condition.
 * @template Input The type of the input value.
 * @param value The input value to test.
 * @param index The zero-based index of the input value in the source iterable.
 * @returns `true` if the input value matches the condition, otherwise `false`.
 */
export type AsyncFilter<Input> = AsyncProcessor<Input, boolean>

/**
 * A function that transforms an input {@link MaybeAsyncIterable} into an output {@link AsyncIterable}.
 * @template Input The type of the input values.
 * @template Output The type of the output values.
 * @param source The input {@link AsyncIterable} to transform.
 * @returns An output {@link AsyncIterable} that produces transformed values from the input.
 */
export type AsyncOperator<Input, Output> = (
  source: MaybeAsyncIterable<Input>,
) => AsyncIterable<Output>

/**
 * A source that can be consumed as either a synchronous or asynchronous iterable.
 * @template T The type of the input values.
 */
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
 * Composes a source iterable with zero or more stream operators.
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
 * Creates an iterable over object entries using string and number keys.
 * @template T The type of the values in the source object.
 * @param source The source object.
 * @returns An {@link AsyncIterable} over the entries of the source object.
 */
export function fromObject<T>(source: Record<string | number, T>): AsyncIterable<[string, T]> {
  return toAsyncIterable(Object.entries(source))
}

/**
 * Projects each input item into a new value.
 * @template Input The type of the input values.
 * @param fn {@link AsyncProcessor} that maps each input item to an output item.
 * @returns An {@link AsyncOperator} that maps input items to output items.
 */
export function map<Input, Output>(
  fn: AsyncProcessor<Input, Output>,
): AsyncOperator<Input, Output> {
  return (source: MaybeAsyncIterable<Input>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<Output> {
      let index = 0
      for await (const item of source) {
        yield fn(item, index++)
      }
    })
}

/**
 * Projects each input item into an iterable and flattens it one level.
 * @template Input The type of the input values.
 * @template Output The type of the output values.
 * @param fn {@link AsyncProcessor} that maps each input item to a {@link MaybeAsyncIterable} of output items.
 * @returns An {@link AsyncOperator} that maps input items to iterables and flattens them into a single output iterable.
 */
export function flatMap<Input, Output>(
  fn: (
    value: Input,
    index: number,
  ) => MaybeAsyncIterable<Output> | Promise<MaybeAsyncIterable<Output>>,
): AsyncOperator<Input, Output> {
  return (source: MaybeAsyncIterable<Input>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<Output> {
      let index = 0
      for await (const item of source) {
        yield* toAsyncIterable(await fn(item, index++))
      }
    })
}

/**
 * Combines each item with the corresponding item from another iterable.
 * @template T The type of the input values from the source iterable.
 * @template R The type of the input values from the other iterable.
 * @param other The {@link MaybeAsyncIterable} to zip with the source iterable.
 * @returns An {@link AsyncOperator} that combines each item with the corresponding item from another iterable.
 */
export function zip<T, R>(other: MaybeAsyncIterable<R>): AsyncOperator<T, [T, R]> {
  return (source: MaybeAsyncIterable<T>) =>
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
 * An operator that skips the first {@link n} items from the source.
 * @template T The type of the input and output values.
 * @param n The number of items to skip.
 * @returns An {@link AsyncOperator} that skips the first {@link n} items from the source.
 */
export function skip<T>(n: number): AsyncOperator<T, T> {
  return (source: MaybeAsyncIterable<T>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<T> {
      let skipped = 0
      for await (const item of source) {
        if (skipped++ < n) {
          continue
        }
        yield item
      }
    })
}

/**
 * An operator that emits only the first {@link n} items from the source.
 * @template T The type of the input and output values.
 * @param n The maximum number of items to emit.
 * @returns An {@link AsyncOperator} that emits only the first {@link n} items from the source.
 */
export function limit<T>(n: number): AsyncOperator<T, T> {
  return (source: MaybeAsyncIterable<T>) =>
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
 * @template T The type of the input values.
 * @template S A subtype of T that satisfies the type guard condition in the predicate function.
 * @param fn {@link AsyncFilter} to test each item for condition matching.
 * @returns An {@link AsyncOperator} that emits only the items matching the predicate.
 */
export function filter<T, S extends T>(
  fn: (value: T, index: number) => value is S,
): AsyncOperator<T, S>
/**
 * Emits only the items matching the predicate.
 * @template T The type of the input and output values.
 * @param fn {@link AsyncFilter} to test each item for condition matching.
 * @returns An {@link AsyncOperator} that emits only the items matching the predicate.
 */
export function filter<T>(fn: AsyncFilter<T>): AsyncOperator<T, T>
export function filter<T>(fn: AsyncFilter<T>): AsyncOperator<T, T> {
  return (source: MaybeAsyncIterable<T>) =>
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
 * @template T The type of the input values.
 * @returns An {@link AsyncOperator} that emits only non-null and non-undefined values.
 */
export function filterDefined<T>(): AsyncOperator<T, NonNullable<T>> {
  return filter<T, NonNullable<T>>(
    (item): item is NonNullable<T> => item !== null && item !== undefined,
  )
}

/**
 * Emits only the first occurrence of each unique value.
 * @template T The type of the input and output values.
 * @returns An {@link AsyncOperator} that emits only the first occurrence of each unique value.
 */
export function distinct<T>(): AsyncOperator<T, T> {
  return (source: MaybeAsyncIterable<T>) =>
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
 * An operator that appends one or more iterables after the source iterable.
 * @template T The type of the input and output values.
 * @param sources One or more {@link MaybeAsyncIterable}s to append after the source iterable.
 * @returns An {@link AsyncOperator} that emits all values from the source iterable followed by all values from the provided iterables in order.
 */
export function append<T>(...sources: MaybeAsyncIterable<T>[]): AsyncOperator<T, T> {
  return (source: MaybeAsyncIterable<T>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<T> {
      yield* source
      for (const other of sources) {
        yield* toAsyncIterable(other)
      }
    })
}

/**
 * Caches produced values so future iterations replay without re-reading the source.
 * **Warning**: Will consume and cache all values from the source on the first iteration, which may lead to high memory usage or non-termination for infinite iterators.
 * @template T The type of the input and output values.
 * @returns An {@link AsyncOperator} that caches values from the source iterable for replay on subsequent iterations.
 */
export function cache<T>(): AsyncOperator<T, T> {
  return (source: MaybeAsyncIterable<T>) => {
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
 * An operator that executes a side-effect function for each item while passing through the original items unchanged.
 * @param fn {@link AsyncProcessor} to execute for each item.
 * @returns An {@link AsyncOperator} that executes the side-effect function for each item and passes through the original items unchanged.
 */
export function onEach<T>(fn: AsyncProcessor<T, void>): AsyncOperator<T, T> {
  return (source: MaybeAsyncIterable<T>) =>
    createAsyncIterable(async function* (): AsyncIterableIterator<T> {
      let index = 0
      for await (const item of source) {
        await fn(item, index++)
        yield item
      }
    })
}

/**
 * Collects all values into a set.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link MaybeAsyncIterable}.
 * @returns The set of all values from the source.
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
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link MaybeAsyncIterable}.
 * @returns The array of all values from the source.
 */
export async function toArray<T>(source: MaybeAsyncIterable<T>): Promise<T[]> {
  return await Array.fromAsync(source)
}

/**
 * Collects values into a map using key and value projections.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @template K The type of the keys in the resulting map.
 * @template U The type of the values in the resulting map.
 * @param source The source {@link MaybeAsyncIterable}.
 * @param key {@link AsyncProcessor} that maps each input item to a key for the map.
 * @param value {@link AsyncProcessor} that maps each input item to a value for the map.
 * @returns The map of key-value pairs.
 */
export async function toMap<T, K, U>(
  source: MaybeAsyncIterable<T>,
  key: AsyncProcessor<T, K>,
  value: AsyncProcessor<T, U>,
): Promise<Map<K, U>> {
  const keyValueIterable = map<T, [K, U]>(async (item, index) => [
    await key(item, index),
    await value(item, index),
  ])(source)
  return new Map<K, U>(await toArray(keyValueIterable))
}

/**
 * Collects values into a record using key and value projections.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @template U The type of the values in the resulting record.
 * @param source The source {@link MaybeAsyncIterable}.
 * @param key {@link AsyncProcessor} that maps each input item to a key for the record.
 * @param value {@link AsyncProcessor} that maps each input item to a value for the record.
 * @returns The record of key-value pairs.
 */
export async function toRecord<T, U>(
  source: MaybeAsyncIterable<T>,
  key: AsyncProcessor<T, string>,
  value: AsyncProcessor<T, U>,
): Promise<Record<string, U>> {
  const keyValueIterable = map<T, [string, U]>(async (item, index) => [
    await key(item, index),
    await value(item, index),
  ])(source)
  return Object.fromEntries(await toArray(keyValueIterable))
}

/**
 * Reduces all values into a single accumulated result.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @template R The type of the accumulated result.
 * @param source The source {@link MaybeAsyncIterable}.
 * @param fn The reducer function to accumulate values.
 * @param initialValue The initial accumulated value.
 * @returns The final accumulated value.
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
 * **Warning**: Will not terminate for infinite iterators.
 * @param source The source {@link MaybeAsyncIterable}.
 * @returns The sum of all values.
 */
export async function sum(source: MaybeAsyncIterable<number>): Promise<number>
/**
 * Sums projected numeric values from a source.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link MaybeAsyncIterable}.
 * @param fn {@link AsyncProcessor} to map each input item to a numeric value.
 * @returns The sum of projected numeric values.
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
 * @template T The type of the input values.
 * @param source The source {@link MaybeAsyncIterable}.
 * @param fn {@link AsyncProcessor} to execute for each item.
 * @returns The original source {@link AsyncIterable} for further consumption.
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
 * Returns the first item or `undefined` if the source is empty.
 * @template T The type of the input values.
 * @param source The souce {@link MaybeAsyncIterable}.
 * @returns The first item or `undefined` if the source is empty.
 */
export async function first<T>(source: MaybeAsyncIterable<T>): Promise<T | undefined> {
  for await (const item of source) {
    return item
  }
  return undefined
}

/**
 * Returns the last item or `undefined` if the source is empty.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The souce {@link MaybeAsyncIterable}.
 * @returns The last item or `undefined` if the source is empty.
 */
export async function last<T>(source: MaybeAsyncIterable<T>): Promise<T | undefined> {
  let lastItem: T | undefined = undefined
  for await (const item of source) {
    lastItem = item
  }
  return lastItem
}

/**
 * Returns the first item matching the predicate.
 * **Warning**: May not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link MaybeAsyncIterable}.
 * @param fn The predicate function to match items.
 * @returns The first item matching the predicate or `undefined` if no match is found.
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
 * **Warning**: May not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link MaybeAsyncIterable}.
 * @param fn The predicate function to match items.
 * @returns `true` if at least one item matches the predicate, otherwise `false`.
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
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link MaybeAsyncIterable}.
 * @param fn The predicate function to match items.
 * @returns `true` if all items match the predicate, otherwise `false`.
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
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values, which must be {@link string} or {@link number}.
 * @param source The source {@link MaybeAsyncIterable} of string or number values to join.
 * @param separator The separator string to insert between values.
 * @returns The joined string of all values separated by the specified separator.
 */
export function join<T extends string | number>(
  source: MaybeAsyncIterable<T>,
  separator: string,
): Promise<string> {
  let index = 0
  return reduce(source, (acc, value) => `${acc}${index++ === 0 ? '' : separator}${value}`, '')
}
