export type AsyncProcessor<Input, Output> = (
  value: Input,
) => Output | Promise<Output>

export type AsyncFilter<Input> = AsyncProcessor<Input, boolean>

export type AsyncFlatMap<Input, Output> = (
  value: Input,
) => Iterable<Output> | AsyncIterable<Output>

export abstract class AsyncStream<T> implements AsyncIterable<T> {
  public static empty<T>() {
    return AsyncStream.from<T>([])
  }

  public static from<T>(
    source: Iterable<T> | AsyncIterable<T>,
  ): AsyncStream<T> {
    return AsyncSourceStream.from(source)
  }

  public static fromObject<T>(
    source: Record<string | number | symbol, T>,
  ): AsyncStream<[string, T]> {
    return AsyncStream.from(Object.entries(source))
  }

  public static fromSingle<T>(value: T): AsyncStream<T> {
    return AsyncStream.from([value])
  }

  public async toSet(): Promise<Set<T>> {
    return new Set(await this.toArray())
  }

  public async toArray(): Promise<T[]> {
    const result = []
    for await (const item of this) {
      result.push(item)
    }
    return result
  }

  public async toMap<K>(fn: AsyncProcessor<T, K>): Promise<Map<K, T>> {
    const entries = this.map(async (x) => [await fn(x), x] as const)
    return new Map(await entries.toArray())
  }

  public async toRecord(
    fn: AsyncProcessor<T, string>,
  ): Promise<Record<string, T>> {
    const entries = this.map(async (x) => [await fn(x), x] as const)
    return Object.fromEntries(await entries.toArray())
  }

  public abstract [Symbol.asyncIterator](): AsyncIterableIterator<T>

  public map<R>(fn: AsyncProcessor<T, R>) {
    return AsyncMapStream.ofPrevious(this, fn)
  }

  public flatMap<R>(fn: AsyncFlatMap<T, R>) {
    return AsyncFlatMapStream.ofPrevious(this, fn)
  }

  public zip<R>(other: Iterable<R> | AsyncIterable<R>) {
    return AsyncZipStream.ofPrevious(this, other)
  }

  public limit(limit: number) {
    return AsyncLimitStream.ofPrevious(this, limit)
  }

  public filter(fn: AsyncFilter<T>) {
    return AsyncFilterStream.ofPrevious(this, fn)
  }

  public filterNonNull() {
    return AsyncFilterStream.ofPrevious(
      this,
      async (x) => x !== null && x !== undefined,
    ) as AsyncFilterStream<NonNullable<T>>
  }

  public async reduce<R>(
    fn: (acc: R, value: T) => R | Promise<R>,
    initialValue: R | Promise<R>,
  ) {
    let acc = await initialValue
    for await (const item of this) {
      acc = await fn(acc, item)
    }
    return acc
  }

  public async sum(fn: T extends number ? void : AsyncProcessor<T, number>) {
    const add = fn
      ? async (a: number, b: T) => a + (await fn(b))
      : (a: number, b: number) => a + b
    return this.reduce((acc, value) => add(acc, value as T & number), 0)
  }

  public async forEach(fn: AsyncProcessor<T, void>) {
    for await (const item of this) {
      fn(item)
    }
    return this
  }

  public distinct() {
    return AsyncDistinctStream.ofPrevious(this)
  }

  public async find(fn: AsyncFilter<T>) {
    for await (const item of this) {
      if (await fn(item)) {
        return item
      }
    }
    return undefined
  }

  public async some(fn: AsyncFilter<T>) {
    for await (const item of this) {
      if (await fn(item)) {
        return true
      }
    }
    return false
  }

  public async every(fn: AsyncFilter<T>) {
    for await (const item of this) {
      if (!(await fn(item))) {
        return false
      }
    }
    return true
  }

  public join(separator: string) {
    return this.reduce((acc, value) => acc + separator + value, '')
  }

  public concat(...streams: AsyncIterable<T>[]) {
    return AsyncConcatStream.ofPrevious(this, ...streams)
  }

  public append(...value: T[]) {
    return this.concat(AsyncStream.from(value))
  }

  public cache() {
    return AsyncCacheStream.ofPrevious(this)
  }
}

class AsyncSourceStream<T> extends AsyncStream<T> {
  private readonly source: Iterable<T> | AsyncIterable<T>

  private constructor(source: Iterable<T> | AsyncIterable<T>) {
    super()
    this.source = source
  }

  public static from<T>(source: Iterable<T> | AsyncIterable<T>) {
    return new AsyncSourceStream(source)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    for await (const value of this.source) {
      yield value
    }
  }
}

class AsyncMapStream<Input, Output> extends AsyncStream<Output> {
  private readonly previous: AsyncStream<Input>
  private readonly fn: AsyncProcessor<Input, Output>

  private constructor(
    previous: AsyncStream<Input>,
    fn: AsyncProcessor<Input, Output>,
  ) {
    super()
    this.previous = previous
    this.fn = fn
  }

  public static ofPrevious<Input, Output>(
    previous: AsyncStream<Input>,
    fn: AsyncProcessor<Input, Output>,
  ) {
    if (previous instanceof AsyncMapStream) {
      return new AsyncMapStream<Input, Output>(
        previous.previous,
        async (value) => fn(await previous.fn(value)),
      )
    }
    return new AsyncMapStream(previous, fn)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<Output> {
    for await (const item of this.previous) {
      yield this.fn(item)
    }
  }
}

class AsyncFlatMapStream<Input, Output> extends AsyncStream<Output> {
  private readonly previous: AsyncStream<Input>
  private readonly fn: AsyncFlatMap<Input, Output>

  private constructor(
    previous: AsyncStream<Input>,
    fn: AsyncFlatMap<Input, Output>,
  ) {
    super()
    this.previous = previous
    this.fn = fn
  }

  public static ofPrevious<Input, Output>(
    previous: AsyncStream<Input>,
    fn: AsyncFlatMap<Input, Output>,
  ) {
    return new AsyncFlatMapStream(previous, fn)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<Output> {
    for await (const item of this.previous) {
      yield* this.fn(item)
    }
  }
}

class AsyncZipStream<T, R> extends AsyncStream<[T, R]> {
  private readonly previous: AsyncStream<T>
  private readonly other: Iterable<R> | AsyncIterable<R>

  private constructor(
    previous: AsyncStream<T>,
    other: Iterable<R> | AsyncIterable<R>,
  ) {
    super()
    this.previous = previous
    this.other = other
  }

  public static ofPrevious<T, R>(
    previous: AsyncStream<T>,
    other: Iterable<R> | AsyncIterable<R>,
  ) {
    return new AsyncZipStream(previous, other)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<[T, R]> {
    const otherIterator =
      Symbol.asyncIterator in this.other
        ? this.other[Symbol.asyncIterator]()
        : this.other[Symbol.iterator]()
    for await (const item of this.previous) {
      const otherItem = await otherIterator.next()
      if (otherItem.done) {
        break
      }
      yield [item, otherItem.value]
    }
  }
}

class AsyncLimitStream<T> extends AsyncStream<T> {
  private readonly previous: AsyncStream<T>
  private readonly n: number

  private constructor(
    previous: AsyncStream<T>,
    n: number,
  ) {
    super()
    this.previous = previous
    this.n = n
  }

  public static ofPrevious<T>(previous: AsyncStream<T>, limit: number) {
    if (previous instanceof AsyncLimitStream) {
      return new AsyncLimitStream<T>(
        previous.previous,
        Math.min(previous.n, limit),
      )
    }
    return new AsyncLimitStream<T>(previous, limit)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    let count = 0
    if (this.n <= count) {
      return
    }
    for await (const item of this.previous) {
      yield item
      if (++count >= this.n) {
        break
      }
    }
  }
}

class AsyncFilterStream<T> extends AsyncStream<T> {
  private readonly previous: AsyncStream<T>
  private readonly fn: AsyncFilter<T>

  private constructor(
    previous: AsyncStream<T>,
    fn: AsyncFilter<T>,
  ) {
    super()
    this.previous = previous
    this.fn = fn
  }

  public static ofPrevious<T>(previous: AsyncStream<T>, fn: AsyncFilter<T>) {
    if (previous instanceof AsyncFilterStream) {
      return new AsyncFilterStream<T>(
        previous.previous,
        async (value) => (await previous.fn(value)) && (await fn(value)),
      )
    }
    return new AsyncFilterStream<T>(previous, fn)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    for await (const item of this.previous) {
      if (await this.fn(item)) {
        yield item
      }
    }
  }
}

class AsyncDistinctStream<T> extends AsyncStream<T> {
  private readonly previous: AsyncStream<T>

  private constructor(previous: AsyncStream<T>) {
    super()
    this.previous = previous
  }

  public static ofPrevious<T>(previous: AsyncStream<T>) {
    if (previous instanceof AsyncDistinctStream) {
      return new AsyncDistinctStream<T>(previous.previous)
    }
    return new AsyncDistinctStream<T>(previous)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    const set = new Set<T>()
    for await (const item of this.previous) {
      if (!set.has(item)) {
        set.add(item)
        yield item
      }
    }
  }
}

class AsyncConcatStream<T> extends AsyncStream<T> {
  private readonly previous: AsyncStream<T>
  private readonly sources: AsyncIterable<T>[]

  private constructor(
    previous: AsyncStream<T>,
    sources: AsyncIterable<T>[],
  ) {
    super()
    this.previous = previous
    this.sources = sources
  }

  public static ofPrevious<T>(
    previous: AsyncStream<T>,
    ...streams: AsyncIterable<T>[]
  ) {
    if (previous instanceof AsyncConcatStream) {
      return new AsyncConcatStream<T>(
        previous.previous,
        previous.sources.concat(streams),
      )
    }
    return new AsyncConcatStream<T>(previous, streams)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    yield* this.previous
    for (const source of this.sources) {
      yield* source
    }
  }
}

class AsyncCacheStream<T> extends AsyncStream<T> {
  private readonly previous: AsyncStream<T>

  private cachedInput: T[] | undefined = undefined

  private constructor(previous: AsyncStream<T>) {
    super()
    this.previous = previous
  }

  public static ofPrevious<T>(previous: AsyncStream<T>) {
    if (previous instanceof AsyncCacheStream) {
      return previous as AsyncCacheStream<T>
    }
    return new AsyncCacheStream<T>(previous)
  }

  public async* [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    if (this.cachedInput) {
      yield* this.cachedInput
      return
    }
    const cache: T[] = []
    for await (const item of this.previous) {
      cache.push(item)
      yield item
    }
    this.cachedInput = cache
  }
}
