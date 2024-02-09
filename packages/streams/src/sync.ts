import { AsyncStream } from '~/async'

export type Processor<Input, Output> = (value: Input) => Output

export type Filter<Input> = Processor<Input, boolean>

export abstract class Stream<T> implements Iterable<T> {
  public static empty<T>() {
    return Stream.from<T>([])
  }

  public static from<T>(source: Iterable<T>): Stream<T> {
    return SourceStream.from(source)
  }

  public static fromObject<T>(
    source: Record<string | number | symbol, T>,
  ): Stream<[string, T]> {
    return Stream.from(Object.entries(source))
  }

  public static fromSingle<T>(value: T): Stream<T> {
    return Stream.from([value])
  }

  public toSet() {
    return new Set(this)
  }

  public toArray() {
    return Array.from(this)
  }

  public toMap<K>(fn: Processor<T, K>): Map<K, T> {
    const stream = this.map((x) => [fn(x), x] as const)
    return new Map(stream)
  }

  public toRecord<U>(
    key: Processor<T, string>,
    value: Processor<T, U>,
  ): Record<string, U> {
    return Object.fromEntries(this.map((x) => [key(x), value?.(x)] as const))
  }

  public abstract [Symbol.iterator](): IterableIterator<T>

  public map<R>(fn: Processor<T, R>) {
    return MapStream.ofPrevious(this, fn)
  }

  public flatMap<R>(fn: Processor<T, Iterable<R>>) {
    return FlatMapStream.ofPrevious(this, fn)
  }

  public zip<R>(other: Iterable<R>) {
    return ZipStream.ofPrevious(this, other)
  }

  public limit(limit: number) {
    return LimitStream.ofPrevious(this, limit)
  }

  public filter(fn: Filter<T>) {
    return FilterStream.ofPrevious(this, fn)
  }

  public filterNonNull() {
    return FilterStream.ofPrevious(
      this,
      (x) => x !== null && x !== undefined,
    ) as FilterStream<NonNullable<T>>
  }

  public reduce<R>(fn: (acc: R, value: T) => R, initialValue: R) {
    let acc = initialValue
    for (const item of this) {
      acc = fn(acc, item)
    }
    return acc
  }

  public sum(fn: T extends number ? void : Processor<T, number>) {
    const add = fn
      ? (a: number, b: T) => a + fn(b)
      : (a: number, b: number) => a + b
    return this.reduce((acc, value) => add(acc, value as T & number), 0)
  }

  public forEach(fn: Processor<T, void>) {
    for (const item of this) {
      fn(item)
    }
    return this
  }

  public toAsync() {
    return AsyncStream.from(this)
  }

  public distinct() {
    return DistinctStream.ofPrevious(this)
  }

  public find(fn: Filter<T>) {
    for (const item of this) {
      if (fn(item)) {
        return item
      }
    }
    return undefined
  }

  public some(fn: Filter<T>) {
    for (const item of this) {
      if (fn(item)) {
        return true
      }
    }
    return false
  }

  public every(fn: Filter<T>) {
    for (const item of this) {
      if (!fn(item)) {
        return false
      }
    }
    return true
  }

  public join(separator: string) {
    return this.reduce((acc, value) => acc + separator + value, '')
  }

  public concat(...sources: Iterable<T>[]) {
    return ConcatStream.ofPrevious(this, sources)
  }

  public append(...value: T[]) {
    return this.concat(Stream.from(value))
  }

  public cache() {
    return CacheStream.ofPrevious(this)
  }
}

class SourceStream<T> extends Stream<T> {
  private constructor(private readonly source: Iterable<T>) {
    super()
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
  private constructor(
    private readonly previous: Stream<Input>,
    private readonly fn: Processor<Input, Output>,
  ) {
    super()
  }

  public static ofPrevious<Input, Output>(
    previous: Stream<Input>,
    fn: Processor<Input, Output>,
  ) {
    if (previous instanceof MapStream) {
      return new MapStream<Input, Output>(previous.previous, (value) =>
        fn(previous.fn(value)))
    }
    return new MapStream(previous, fn)
  }

  public *[Symbol.iterator](): IterableIterator<Output> {
    for (const item of this.previous) {
      yield this.fn(item)
    }
  }
}

class FlatMapStream<Input, Output> extends Stream<Output> {
  private constructor(
    private readonly previous: Stream<Input>,
    private readonly fn: Processor<Input, Iterable<Output>>,
  ) {
    super()
  }

  public static ofPrevious<Input, Output>(
    previous: Stream<Input>,
    fn: Processor<Input, Iterable<Output>>,
  ) {
    return new FlatMapStream(previous, fn)
  }

  public *[Symbol.iterator](): IterableIterator<Output> {
    for (const item of this.previous) {
      yield * this.fn(item)
    }
  }
}

class ZipStream<T, R> extends Stream<[T, R]> {
  private constructor(
    private readonly previous: Stream<T>,
    private readonly other: Iterable<R>,
  ) {
    super()
  }

  public static ofPrevious<T, R>(
    previous: Stream<T>,
    other: Iterable<R>,
  ): ZipStream<T, R> {
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
  private constructor(
    private readonly previous: Stream<T>,
    private readonly n: number,
  ) {
    super()
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
  private constructor(
    private readonly previous: Stream<T>,
    private readonly fn: Filter<T>,
  ) {
    super()
  }

  public static ofPrevious<T>(previous: Stream<T>, fn: Filter<T>) {
    if (previous instanceof FilterStream) {
      return new FilterStream<T>(
        previous.previous,
        (value) => previous.fn(value) && fn(value),
      )
    }
    return new FilterStream<T>(previous, fn)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    for (const item of this.previous) {
      if (this.fn(item)) {
        yield item
      }
    }
  }
}

class DistinctStream<T> extends Stream<T> {
  private constructor(private readonly previous: Stream<T>) {
    super()
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
  private constructor(
    private readonly previous: Stream<T>,
    private readonly sources: Iterable<T>[],
  ) {
    super()
  }

  public static ofPrevious<T>(
    previous: Stream<T>,
    sources: Iterable<T>[],
  ): Stream<T> {
    if (previous instanceof ConcatStream) {
      return new ConcatStream<T>(
        previous.previous,
        previous.sources.concat(...sources),
      )
    }
    return new ConcatStream<T>(previous, sources)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    yield * this.previous
    for (const source of this.sources) {
      yield * source
    }
  }
}

class CacheStream<T> extends Stream<T> {
  private cachedInput: T[] | undefined = undefined

  private constructor(private readonly previous: Stream<T>) {
    super()
  }

  public static ofPrevious<T>(previous: Stream<T>) {
    if (previous instanceof CacheStream) {
      return previous
    }
    return new CacheStream<T>(previous)
  }

  public *[Symbol.iterator](): IterableIterator<T> {
    if (this.cachedInput) {
      yield * this.cachedInput
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
