export interface Result<D, E> extends Succeedable<D>, Failable<E> {
  readonly isOk: boolean
  readonly isError: boolean

  andThen: <T>(map: (data: D) => Result<T, E>) => Result<T, E>
  map: <T>(map: (data: D) => T) => Result<T, E>
  mapError: <U>(map: (error: E) => U) => Result<D, U>
}

export interface Succeedable<D> {
  get: () => D
  getOrElse: (other: D) => D
  getOrNull: () => D | null
  getOrUndefined: () => D | undefined
}

export interface Succeeded<D> extends Succeedable<D> {
  getOrElse: () => D
  getOrNull: () => D
  getOrUndefined: () => D
}

export interface Failable<E> {
  getError: () => E
  getErrorOrElse: (other: E) => E
  getErrorOrNull: () => E | null
  getErrorOrUndefined: () => E | undefined
}

export interface Failed<E> extends Failable<E> {
  getErrorOrElse: () => E
  getErrorOrNull: () => E
  getErrorOrUndefined: () => E
}

export class IllegalStateError extends Error {}
