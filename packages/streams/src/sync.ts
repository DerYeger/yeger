import { AsyncStream } from '~/async'

export type Processor<Input, Output> = (value: Input) => Output

export type Filter<Input> = Processor<Input, boolean>

export abstract class Stream<T> implements Iterable<T> {
  public static fromObject<T>(
    source: Record<string | number | symbol, T>
  ): Stream<[string, T]> {
    return Stream.from(Object.entries(source))
  }

  public static from<T>(source: Iterable<T>): Stream<T> {
    return SourceStream.from(source)
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

  public toRecord(fn: Processor<T, string>): Record<string, T> {
    return Object.fromEntries(this.map((x) => [fn(x), x] as const))
  }

  public abstract [Symbol.iterator](): IterableIterator<T>

  public map<R>(fn: Processor<T, R>) {
    return MapStream.ofPrevious(this, fn)
  }

  public flatMap<R>(fn: Processor<T, Iterable<R>>) {
    return FlatMapStream.ofPrevious(this, fn)
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
      (x) => x !== null && x !== undefined
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
    private readonly fn: Processor<Input, Output>
  ) {
    super()
  }

  public static ofPrevious<Input, Output>(
    previous: Stream<Input>,
    fn: Processor<Input, Output>
  ) {
    if (previous instanceof MapStream) {
      return new MapStream<Input, Output>(previous.previous, (value) =>
        fn(previous.fn(value))
      )
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
    private readonly fn: Processor<Input, Iterable<Output>>
  ) {
    super()
  }

  public static ofPrevious<Input, Output>(
    previous: Stream<Input>,
    fn: Processor<Input, Iterable<Output>>
  ) {
    return new FlatMapStream(previous, fn)
  }

  public *[Symbol.iterator](): IterableIterator<Output> {
    for (const item of this.previous) {
      yield* this.fn(item)
    }
  }
}

class LimitStream<T> extends Stream<T> {
  private constructor(
    private readonly previous: Stream<T>,
    private readonly n: number
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
    private readonly fn: Filter<T>
  ) {
    super()
  }

  public static ofPrevious<T>(previous: Stream<T>, fn: Filter<T>) {
    if (previous instanceof FilterStream) {
      return new FilterStream<T>(
        previous.previous,
        (value) => previous.fn(value) && fn(value)
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
