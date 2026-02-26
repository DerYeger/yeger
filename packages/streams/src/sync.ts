/**
 * A callback function that processes an input value and produces an output value.
 * @template Input The type of the input value.
 * @template Output The type of the output value.
 * @param value The input value to process.
 * @param index The zero-based index of the input value in the source iterable.
 * @returns The processed output value.
 */
export type Processor<Input, Output> = (value: Input, index: number) => Output

/**
 * A {@link Processor} that produces a boolean output to indicate whether an input value matches a condition.
 * @template Input The type of the input value.
 * @param value The input value to test.
 * @param index The zero-based index of the input value in the source iterable.
 * @returns `true` if the input value matches the condition, otherwise `false`.
 */
export type Filter<Input> = Processor<Input, boolean>

/**
 * A function that transforms an input {@link Iterable} into an output {@link Iterable}.
 * @template Input The type of the input values.
 * @template Output The type of the output values.
 * @param source The input {@link Iterable} to transform.
 * @returns An output {@link Iterable} that produces transformed values from the input.
 */
export type Operator<Input, Output> = (source: Iterable<Input>) => Iterable<Output>

function createIterable<T>(factory: () => IterableIterator<T>): Iterable<T> {
  return {
    [Symbol.iterator]: factory,
  }
}

/**
 * Composes a source iterable with zero or more stream operators.
 */
export function pipe<T>(source: Iterable<T>): Iterable<T>
export function pipe<T0, T1>(source: Iterable<T0>, op1: Operator<T0, T1>): Iterable<T1>
export function pipe<T0, T1, T2>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
): Iterable<T2>
export function pipe<T0, T1, T2, T3>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
): Iterable<T3>
export function pipe<T0, T1, T2, T3, T4>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
): Iterable<T4>
export function pipe<T0, T1, T2, T3, T4, T5>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
): Iterable<T5>
export function pipe<T0, T1, T2, T3, T4, T5, T6>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
): Iterable<T6>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
): Iterable<T7>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
): Iterable<T8>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
): Iterable<T9>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
): Iterable<T10>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
): Iterable<T11>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
): Iterable<T12>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
  op13: Operator<T12, T13>,
): Iterable<T13>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
  op13: Operator<T12, T13>,
  op14: Operator<T13, T14>,
): Iterable<T14>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
  op13: Operator<T12, T13>,
  op14: Operator<T13, T14>,
  op15: Operator<T14, T15>,
): Iterable<T15>
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
  op13: Operator<T12, T13>,
  op14: Operator<T13, T14>,
  op15: Operator<T14, T15>,
  op16: Operator<T15, T16>,
): Iterable<T16>
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
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
  op13: Operator<T12, T13>,
  op14: Operator<T13, T14>,
  op15: Operator<T14, T15>,
  op16: Operator<T15, T16>,
  op17: Operator<T16, T17>,
): Iterable<T17>
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
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
  op13: Operator<T12, T13>,
  op14: Operator<T13, T14>,
  op15: Operator<T14, T15>,
  op16: Operator<T15, T16>,
  op17: Operator<T16, T17>,
  op18: Operator<T17, T18>,
): Iterable<T18>
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
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
  op13: Operator<T12, T13>,
  op14: Operator<T13, T14>,
  op15: Operator<T14, T15>,
  op16: Operator<T15, T16>,
  op17: Operator<T16, T17>,
  op18: Operator<T17, T18>,
  op19: Operator<T18, T19>,
): Iterable<T19>
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
  source: Iterable<T0>,
  op1: Operator<T0, T1>,
  op2: Operator<T1, T2>,
  op3: Operator<T2, T3>,
  op4: Operator<T3, T4>,
  op5: Operator<T4, T5>,
  op6: Operator<T5, T6>,
  op7: Operator<T6, T7>,
  op8: Operator<T7, T8>,
  op9: Operator<T8, T9>,
  op10: Operator<T9, T10>,
  op11: Operator<T10, T11>,
  op12: Operator<T11, T12>,
  op13: Operator<T12, T13>,
  op14: Operator<T13, T14>,
  op15: Operator<T14, T15>,
  op16: Operator<T15, T16>,
  op17: Operator<T16, T17>,
  op18: Operator<T17, T18>,
  op19: Operator<T18, T19>,
  op20: Operator<T19, T20>,
): Iterable<T20>
export function pipe(source: Iterable<any>, ...operators: Operator<any, any>[]): Iterable<any> {
  let result: Iterable<any> = source
  for (const operator of operators as readonly Operator<any, any>[]) {
    result = operator(result)
  }
  return result
}

/**
 * Creates an iterable over object entries using string and number keys.
 * @template T The type of the values in the source object.
 * @param source The source object.
 * @returns An {@link Iterable} over the entries of the source object.
 */
export function fromObject<T>(source: Record<string | number, T>): Iterable<[string, T]> {
  return Object.entries(source)
}

/**
 * Projects each input item into a new value.
 * @template Input The type of the input values.
 * @param fn {@link Processor} that maps each input item to an output item.
 * @returns An {@link Operator} that maps input items to output items.
 */
export function map<Input, Output>(fn: Processor<Input, Output>): Operator<Input, Output> {
  return (source: Iterable<Input>) =>
    createIterable(function* (): IterableIterator<Output> {
      let index = 0
      for (const item of source) {
        yield fn(item, index++)
      }
    })
}

/**
 * Projects each input item into an iterable and flattens it one level.
 * @template Input The type of the input values.
 * @template Output The type of the output values.
 * @param fn {@link Processor} that maps each input item to an {@link Iterable} of output items.
 * @returns An {@link Operator} that maps input items to iterables and flattens them into a single output iterable.
 */
export function flatMap<Input, Output>(
  fn: Processor<Input, Iterable<Output>>,
): Operator<Input, Output> {
  return (source: Iterable<Input>) =>
    createIterable(function* (): IterableIterator<Output> {
      let index = 0
      for (const item of source) {
        yield* fn(item, index++)
      }
    })
}

/**
 * Combines each item with the corresponding item from another iterable.
 * @template T The type of the input values from the source iterable.
 * @template R The type of the input values from the other iterable.
 * @param other The {@link Iterable} to zip with the source iterable.
 * @returns An {@link Operator} that combines each item with the corresponding item from another iterable.
 */
export function zip<T, R>(other: Iterable<R>): Operator<T, [T, R]> {
  return (source: Iterable<T>) =>
    createIterable(function* (): IterableIterator<[T, R]> {
      const otherIterator = other[Symbol.iterator]()
      for (const item of source) {
        const otherItem = otherIterator.next()
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
 * @returns An {@link Operator} that skips the first {@link n} items from the source.
 */
export function skip<T>(n: number): Operator<T, T> {
  return (source: Iterable<T>) =>
    createIterable(function* (): IterableIterator<T> {
      let skipped = 0
      for (const item of source) {
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
 * @returns An {@link Operator} that emits only the first {@link n} items from the source.
 */
export function limit<T>(n: number): Operator<T, T> {
  return (source: Iterable<T>) =>
    createIterable(function* (): IterableIterator<T> {
      if (n <= 0) {
        return
      }
      let count = 0
      for (const item of source) {
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
 * @param fn {@link Filter} to test each item for condition matching.
 * @returns An {@link Operator} that emits only the items matching the predicate.
 */
export function filter<T, S extends T>(fn: (value: T, index: number) => value is S): Operator<T, S>
/**
 * Emits only the items matching the predicate.
 * @template T The type of the input and output values.
 * @param fn {@link Filter} to test each item for condition matching.
 * @returns An {@link Operator} that emits only the items matching the predicate.
 */
export function filter<T>(fn: Filter<T>): Operator<T, T>
export function filter<T>(fn: Filter<T>): Operator<T, T> {
  return (source: Iterable<T>) =>
    createIterable(function* (): IterableIterator<T> {
      let index = 0
      for (const item of source) {
        if (fn(item, index++)) {
          yield item
        }
      }
    })
}

/**
 * Emits only non-null and non-undefined values.
 * @template T The type of the input values.
 * @returns An {@link Operator} that emits only non-null and non-undefined values.
 */
export function filterDefined<T>(): Operator<T, NonNullable<T>> {
  return filter<T, NonNullable<T>>(
    (value): value is NonNullable<T> => value !== null && value !== undefined,
  )
}

/**
 * Emits only the first occurrence of each unique value.
 * @template T The type of the input and output values.
 * @returns An {@link Operator} that emits only the first occurrence of each unique value.
 */
export function distinct<T>(): Operator<T, T> {
  return (source: Iterable<T>) =>
    createIterable(function* (): IterableIterator<T> {
      const seen = new Set<T>()
      for (const item of source) {
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
 * @param sources One or more {@link Iterable}s to append after the source iterable.
 * @returns An {@link Operator} that emits all values from the source iterable followed by all values from the provided iterables in order.
 */
export function append<T>(...sources: Iterable<T>[]): Operator<T, T> {
  return (source: Iterable<T>) =>
    createIterable(function* (): IterableIterator<T> {
      yield* source
      for (const other of sources) {
        yield* other
      }
    })
}

/**
 * Caches produced values so future iterations replay without re-reading the source.
 * **Warning**: Will consume and cache all values from the source on the first iteration, which may lead to high memory usage or non-termination for infinite iterators.
 * @template T The type of the input and output values.
 * @returns An {@link Operator} that caches values from the source iterable for replay on subsequent iterations.
 */
export function cache<T>(): Operator<T, T> {
  return (source: Iterable<T>) => {
    let cachedInput: T[] | undefined
    return createIterable(function* (): IterableIterator<T> {
      if (cachedInput) {
        yield* cachedInput
        return
      }
      const cacheBuffer: T[] = []
      for (const item of source) {
        cacheBuffer.push(item)
        yield item
      }
      cachedInput = cacheBuffer
    })
  }
}

/**
 * An operator that executes a side-effect function for each item while passing through the original items unchanged.
 * @param fn {@link Processor} to execute for each item.
 * @returns An {@link Operator} that executes the side-effect function for each item and passes through the original items unchanged.
 */
export function onEach<T>(fn: Processor<T, void>): Operator<T, T> {
  return (source: Iterable<T>) =>
    createIterable(function* (): IterableIterator<T> {
      let index = 0
      for (const item of source) {
        fn(item, index++)
        yield item
      }
    })
}

/**
 * Collects all values into a set.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link Iterable}.
 * @returns The set of all values from the source.
 */
export function toSet<T>(source: Iterable<T>): Set<T> {
  return new Set(source)
}

/**
 * Collects all values into an array.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link Iterable}.
 * @returns The array of all values from the source.
 */
export function toArray<T>(source: Iterable<T>): T[] {
  return Array.from(source)
}

/**
 * Collects values into a map using key and value projections.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @template K The type of the keys in the resulting map.
 * @template U The type of the values in the resulting map.
 * @param source The source {@link Iterable}.
 * @param key {@link Processor} that maps each input item to a key for the map.
 * @param value {@link Processor} that maps each input item to a value for the map.
 * @returns The map of key-value pairs.
 */
export function toMap<T, K, U>(
  source: Iterable<T>,
  key: Processor<T, K>,
  value: Processor<T, U>,
): Map<K, U> {
  const keyValueIterable = map<T, [K, U]>((item, index) => [key(item, index), value(item, index)])(
    source,
  )
  return new Map<K, U>(keyValueIterable)
}

/**
 * Collects values into a record using key and value projections.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @template U The type of the values in the resulting record.
 * @param source The source {@link Iterable}.
 * @param key {@link Processor} that maps each input item to a key for the record.
 * @param value {@link Processor} that maps each input item to a value for the record.
 * @returns The record of key-value pairs.
 */
export function toRecord<T, U>(
  source: Iterable<T>,
  key: Processor<T, string>,
  value: Processor<T, U>,
): Record<string, U> {
  const keyValueIterable = map<T, [string, U]>((item, index) => [
    key(item, index),
    value(item, index),
  ])(source)
  return Object.fromEntries(keyValueIterable)
}

/**
 * Reduces all values into a single accumulated result.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @template R The type of the accumulated result.
 * @param source The source {@link Iterable}.
 * @param fn The reducer function to accumulate values.
 * @param initialValue The initial accumulated value.
 * @returns The final accumulated value.
 */
export function reduce<T, R>(
  source: Iterable<T>,
  fn: (acc: R, value: T, index: number) => R,
  initialValue: R,
): R {
  let acc = initialValue
  let index = 0
  for (const item of source) {
    acc = fn(acc, item, index++)
  }
  return acc
}

/**
 * Sums numeric values from a source.
 * **Warning**: Will not terminate for infinite iterators.
 * @param source The souce {@link Iterable}.
 * @returns The sum of all values.
 */
export function sum(source: Iterable<number>): number
/**
 * Sums projected numeric values from a source.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The souce {@link Iterable}.
 * @param fn {@link Processor} to map each input item to a numeric value.
 * @returns The sum of projected numeric values.
 */
export function sum<T>(source: Iterable<T>, fn: Processor<T, number>): number
export function sum<T>(source: Iterable<T>, fn?: Processor<T, number>): number {
  return fn
    ? reduce(source, (acc, value, index) => acc + fn(value, index), 0)
    : reduce(source as Iterable<number>, (acc, value) => acc + value, 0)
}

/**
 * Executes a callback for each item and returns the original source.
 * @template T The type of the input values.
 * @param source The souce {@link Iterable}.
 * @param fn {@link Processor} to execute for each item.
 * @returns The original source {@link Iterable} for further consumption.
 */
export function forEach<T>(source: Iterable<T>, fn: Processor<T, void>): Iterable<T> {
  let index = 0
  for (const item of source) {
    fn(item, index++)
  }
  return source
}

/**
 * Returns the first item or `undefined` if the source is empty.
 * @template T The type of the input values.
 * @param source The souce {@link Iterable}.
 * @returns The first item or `undefined` if the source is empty.
 */
export function first<T>(source: Iterable<T>): T | undefined {
  for (const item of source) {
    return item
  }
  return undefined
}

/**
 * Returns the last item or `undefined` if the source is empty.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The souce {@link Iterable}.
 * @returns The last item or `undefined` if the source is empty.
 */
export function last<T>(source: Iterable<T>): T | undefined {
  let lastItem: T | undefined = undefined
  for (const item of source) {
    lastItem = item
  }
  return lastItem
}

/**
 * Returns the first item matching the predicate.
 * **Warning**: May not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link Iterable}.
 * @param fn The predicate function to match items.
 * @returns The first item matching the predicate or `undefined` if no match is found.
 */
export function find<T>(source: Iterable<T>, fn: Filter<T>): T | undefined {
  let index = 0
  for (const item of source) {
    if (fn(item, index++)) {
      return item
    }
  }
  return undefined
}

/**
 * Returns true if at least one item matches the predicate.
 * **Warning**: May not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link Iterable}.
 * @param fn The predicate function to match items.
 * @returns `true` if at least one item matches the predicate, otherwise `false`.
 */
export function some<T>(source: Iterable<T>, fn: Filter<T>): boolean {
  let index = 0
  for (const item of source) {
    if (fn(item, index++)) {
      return true
    }
  }
  return false
}

/**
 * Returns true if all items match the predicate.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values.
 * @param source The source {@link Iterable}.
 * @param fn The predicate function to match items.
 * @returns `true` if all items match the predicate, otherwise `false`.
 */
export function every<T>(source: Iterable<T>, fn: Filter<T>): boolean {
  let index = 0
  for (const item of source) {
    if (!fn(item, index++)) {
      return false
    }
  }
  return true
}

/**
 * Joins string or number values with a separator.
 * **Warning**: Will not terminate for infinite iterators.
 * @template T The type of the input values, which must be {@link string} or {@link number}.
 * @param source The source {@link Iterable} of string or number values to join.
 * @param separator The separator string to insert between values.
 * @returns The joined string of all values separated by the specified separator.
 */
export function join<T extends string | number>(source: Iterable<T>, separator: string): string {
  let index = 0
  return reduce(source, (acc, value) => `${acc}${index++ === 0 ? '' : separator}${value}`, '')
}
