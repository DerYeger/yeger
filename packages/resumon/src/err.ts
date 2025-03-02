import type { Failed, Result } from '~/result'
import { IllegalStateError } from '~/result'

export class Err<D, E> implements Result<D, E>, Failed<E> {
  public readonly isOk = false
  public readonly isError = true

  private readonly error: E

  public constructor(error: E) {
    this.error = error
  }

  public get(): D {
    throw new IllegalStateError('Cannot get data or Err')
  }

  public getOrElse(other: D): D {
    return other
  }

  public getOrNull(): null {
    return null
  }

  public getOrUndefined(): undefined {
    return undefined
  }

  public getError(): E {
    return this.error
  }

  public getErrorOrElse(): E {
    return this.error
  }

  public getErrorOrNull(): E {
    return this.error
  }

  public getErrorOrUndefined(): E {
    return this.error
  }

  public andThen<T>(): Result<T, E> {
    return this as unknown as Result<T, E>
  }

  public map<T>(): Result<T, E> {
    return this as unknown as Result<T, E>
  }

  public mapError<T, U>(map: (error: E) => U): Result<T, U> {
    return new Err(map(this.error))
  }
}

export function err<D, E>(error: E): Result<D, E> {
  return new Err(error)
}
