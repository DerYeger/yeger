export type Processor<Input, Output> = (value: Input, index: number) => Output

export type Filter<Input> = Processor<Input, boolean>

export abstract class Stream<T> implements Iterable<T> {
  public static empty<T>(): Stream<T> {
    return Stream.from<T>([])
  }

  public static from<T>(source: Iterable<T>): Stream<T> {
    return SourceStream.from(source)
  }

  public static fromObject<T>(source: Record<string | number | symbol, T>): Stream<[string, T]> {
    return Stream.from(Object.entries(source))
  }

  public static fromSingle<T>(value: T): Stream<T> {
    return Stream.from([value])
  }

  public toSet(): Set<T> {
    return new Set(this)
  }

  public toArray(): T[] {
    return Array.from(this)
  }

  public toMap<K>(fn: Processor<T, K>): Map<K, T> {
    const stream = this.map((value, index) => [fn(value, index), value] as const)
    return new Map(stream)
  }

  public toRecord<U>(key: Processor<T, string>, value: Processor<T, U>): Record<string, U> {
    return Object.fromEntries(this.map((x, index) => [key(x, index), value?.(x, index)] as const))
  }

  public abstract [Symbol.iterator](): IterableIterator<T>

  public map<R>(fn: Processor<T, R>): Stream<R> {
    return MapStream.ofPrevious(this, fn)
  }

  public flatMap<R>(fn: Processor<T, Iterable<R>>): Stream<R> {
    return FlatMapStream.ofPrevious(this, fn)
  }

  public zip<R>(other: Iterable<R>): Stream<[T, R]> {
    return ZipStream.ofPrevious(this, other)
  }

  public limit(limit: number): Stream<T> {
    return LimitStream.ofPrevious(this, limit)
  }

  public filter(fn: Filter<T>): Stream<T> {
    return FilterStream.ofPrevious(this, fn)
  }

  public filterNonNull(): Stream<NonNullable<T>> {
    return FilterStream.ofPrevious(
      this,
      (value) => value !== null && value !== undefined,
    ) as FilterStream<NonNullable<T>>
  }

  public reduce<R>(fn: (acc: R, value: T, index: number) => R, initialValue: R): R {
    let acc = initialValue
    let index = 0
    for (const item of this) {
      acc = fn(acc, item, index++)
    }
    return acc
  }

  public sum(fn: T extends number ? void : Processor<T, number>): number {
    const add = fn
      ? (a: number, b: T, index: number) => a + fn(b, index)
      : (a: number, b: number) => a + b
    return this.reduce((acc, value, index) => add(acc, value as T & number, index), 0)
  }

  public forEach(fn: Processor<T, void>): Stream<T> {
    let index = 0
    for (const item of this) {
      fn(item, index++)
    }
    return this
  }

  public distinct(): Stream<T> {
    return DistinctStream.ofPrevious(this)
  }

  public find(fn: Filter<T>): T | undefined {
    let index = 0
    for (const item of this) {
      if (fn(item, index++)) {
        return item
      }
    }
    return undefined
  }

  public some(fn: Filter<T>): boolean {
    let index = 0
    for (const item of this) {
      if (fn(item, index++)) {
        return true
      }
    }
    return false
  }

  public every(fn: Filter<T>): boolean {
    let index = 0
    for (const item of this) {
      if (!fn(item, index++)) {
        return false
      }
    }
    return true
  }

  public join(separator: string): string {
    return this.reduce((acc, value) => acc + separator + value, '')
  }

  public concat(...sources: Iterable<T>[]): Stream<T> {
    return ConcatStream.ofPrevious(this, sources)
  }

  public append(...value: T[]): Stream<T> {
    return this.concat(Stream.from(value))
  }

  public cache(): Stream<T> {
    return CacheStream.ofPrevious(this)
  }
}

class SourceStream<T> extends Stream<T> {
  private readonly source: Iterable<T>

  private constructor(source: Iterable<T>) {
    super()
    this.source = source
  }

  public static from<T>(source: Iterable<T>) {
    return new SourceStream(source)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    for (const value of this.source) {
      yield value
    }
  }
}

class MapStream<Input, Output> extends Stream<Output> {
  private readonly previous: Stream<Input>
  private readonly fn: Processor<Input, Output>

  private constructor(previous: Stream<Input>, fn: Processor<Input, Output>) {
    super()
    this.previous = previous
    this.fn = fn
  }

  public static ofPrevious<Input, Output>(previous: Stream<Input>, fn: Processor<Input, Output>) {
    if (previous instanceof MapStream) {
      return new MapStream<Input, Output>(previous.previous, (value, index) =>
        fn(previous.fn(value, index), index),
      )
    }
    return new MapStream(previous, fn)
  }

  public *[Symbol.iterator](): IterableIterator<Output> {
    let index = 0
    for (const item of this.previous) {
      yield this.fn(item, index++)
    }
  }
}

class FlatMapStream<Input, Output> extends Stream<Output> {
  private readonly previous: Stream<Input>
  private readonly fn: Processor<Input, Iterable<Output>>

  private constructor(previous: Stream<Input>, fn: Processor<Input, Iterable<Output>>) {
    super()
    this.previous = previous
    this.fn = fn
  }

  public static ofPrevious<Input, Output>(
    previous: Stream<Input>,
    fn: Processor<Input, Iterable<Output>>,
  ) {
    return new FlatMapStream(previous, fn)
  }

  public *[Symbol.iterator](): IterableIterator<Output> {
    let index = 0
    for (const item of this.previous) {
      yield* this.fn(item, index++)
    }
  }
}

class ZipStream<T, R> extends Stream<[T, R]> {
  private readonly previous: Stream<T>
  private readonly other: Iterable<R>

  private constructor(previous: Stream<T>, other: Iterable<R>) {
    super()
    this.previous = previous
    this.other = other
  }

  public static ofPrevious<T, R>(previous: Stream<T>, other: Iterable<R>): ZipStream<T, R> {
    return new ZipStream(previous, other)
  }

  public *[Symbol.iterator](): IterableIterator<[T, R]> {
    const otherIterator = this.other[Symbol.iterator]()
    for (const item of this.previous) {
      const otherItem = otherIterator.next()
      if (otherItem.done) {
        break
      }
      yield [item, otherItem.value]
    }
  }
}

class LimitStream<T> extends Stream<T> {
  private readonly previous: Stream<T>
  private readonly n: number

  private constructor(previous: Stream<T>, n: number) {
    super()
    this.previous = previous
    this.n = n
  }

  public static ofPrevious<T>(previous: Stream<T>, limit: number) {
    if (previous instanceof LimitStream) {
      return new LimitStream<T>(previous.previous, Math.min(previous.n, limit))
    }
    return new LimitStream<T>(previous, limit)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    let count = 0
    if (this.n <= count) {
      return
    }
    for (const item of this.previous) {
      yield item
      if (++count >= this.n) {
        break
      }
    }
  }
}

class FilterStream<T> extends Stream<T> {
  private readonly previous: Stream<T>
  private readonly fn: Filter<T>

  private constructor(previous: Stream<T>, fn: Filter<T>) {
    super()
    this.previous = previous
    this.fn = fn
  }

  public static ofPrevious<T>(previous: Stream<T>, fn: Filter<T>) {
    if (previous instanceof FilterStream) {
      return new FilterStream<T>(
        previous.previous,
        (value, index) => previous.fn(value, index) && fn(value, index),
      )
    }
    return new FilterStream<T>(previous, fn)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    let index = 0
    for (const item of this.previous) {
      if (this.fn(item, index++)) {
        yield item
      }
    }
  }
}

class DistinctStream<T> extends Stream<T> {
  private readonly previous: Stream<T>

  private constructor(previous: Stream<T>) {
    super()
    this.previous = previous
  }

  public static ofPrevious<T>(previous: Stream<T>) {
    if (previous instanceof DistinctStream) {
      return new DistinctStream<T>(previous.previous)
    }
    return new DistinctStream<T>(previous)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    const set = new Set<T>()
    for (const item of this.previous) {
      if (!set.has(item)) {
        set.add(item)
        yield item
      }
    }
  }
}

class ConcatStream<T> extends Stream<T> {
  private readonly previous: Stream<T>
  private readonly sources: Iterable<T>[]

  private constructor(previous: Stream<T>, sources: Iterable<T>[]) {
    super()
    this.previous = previous
    this.sources = sources
  }

  public static ofPrevious<T>(previous: Stream<T>, sources: Iterable<T>[]): Stream<T> {
    if (previous instanceof ConcatStream) {
      return new ConcatStream<T>(previous.previous, previous.sources.concat(...sources))
    }
    return new ConcatStream<T>(previous, sources)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    yield* this.previous
    for (const source of this.sources) {
      yield* source
    }
  }
}

class CacheStream<T> extends Stream<T> {
  private readonly previous: Stream<T>

  private cachedInput: T[] | undefined = undefined

  private constructor(previous: Stream<T>) {
    super()
    this.previous = previous
  }

  public static ofPrevious<T>(previous: Stream<T>) {
    if (previous instanceof CacheStream) {
      return previous as CacheStream<T>
    }
    return new CacheStream<T>(previous)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    if (this.cachedInput) {
      yield* this.cachedInput
      return
    }
    const cache: T[] = []
    for (const item of this.previous) {
      cache.push(item)
      yield item
    }
    this.cachedInput = cache
  }
}
