export type Processor<Input, Output> = (value: Input, index: number) => Output

export type Filter<Input> = Processor<Input, boolean>

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
 */
export function fromObject<T>(source: Record<string | number, T>): Iterable<[string, T]> {
  return Object.entries(source)
}

/**
 * Projects each input item into a new value.
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
 * Emits at most the first n items from the source.
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
 */
export function filter<T, S extends T>(fn: (value: T, index: number) => value is S): Operator<T, S>
/**
 * Emits only the items matching the predicate.
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
 */
export function filterDefined<T>(): Operator<T, NonNullable<T>> {
  return filter<T, NonNullable<T>>(
    (value): value is NonNullable<T> => value !== null && value !== undefined,
  )
}

/**
 * Emits only the first occurrence of each unique value.
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
 * Appends one or more iterables after the source iterable.
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
 * Collects all values into a set.
 */
export function toSet<T>(source: Iterable<T>): Set<T> {
  return new Set(source)
}

/**
 * Collects all values into an array.
 */
export function toArray<T>(source: Iterable<T>): T[] {
  return Array.from(source)
}

/**
 * Collects values into a map using key and value projections.
 */
export function toMap<T, K, U>(
  source: Iterable<T>,
  key: Processor<T, K>,
  value: Processor<T, U>,
): Map<K, U> {
  let index = 0
  const result = new Map<K, U>()
  for (const item of source) {
    result.set(key(item, index), value(item, index))
    index++
  }
  return result
}

/**
 * Collects values into a record using key and value projections.
 */
export function toRecord<T, U>(
  source: Iterable<T>,
  key: Processor<T, string>,
  value: Processor<T, U>,
): Record<string, U> {
  const result: Record<string, U> = {}
  let index = 0
  for (const item of source) {
    result[key(item, index)] = value(item, index)
    index++
  }
  return result
}

/**
 * Reduces all values into a single accumulated result.
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
 */
export function sum(source: Iterable<number>): number
/**
 * Sums projected numeric values from a source.
 */
export function sum<T>(source: Iterable<T>, fn: Processor<T, number>): number
export function sum<T>(source: Iterable<T>, fn?: Processor<T, number>): number {
  return fn
    ? reduce(source, (acc, value, index) => acc + fn(value, index), 0)
    : reduce(source as Iterable<number>, (acc, value) => acc + value, 0)
}

/**
 * Executes a callback for each item and returns the original source.
 */
export function forEach<T>(source: Iterable<T>, fn: Processor<T, void>): Iterable<T> {
  let index = 0
  for (const item of source) {
    fn(item, index++)
  }
  return source
}

/**
 * Returns the first item matching the predicate.
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
 */
export function join<T extends string | number>(source: Iterable<T>, separator: string): string {
  let index = 0
  return reduce(source, (acc, value) => `${acc}${index++ === 0 ? '' : separator}${value}`, '')
}
