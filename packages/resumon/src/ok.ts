import type { Result, Succeeded } from '~/result'
import { IllegalStateError } from '~/result'

export class Ok<D, E> implements Result<D, E>, Succeeded<D> {
  public readonly isOk = true
  public readonly isError = false

  private readonly data: D

  public constructor(data: D) {
    this.data = data
  }

  public get(): D {
    return this.data
  }

  public getOrElse(): D {
    return this.data
  }

  public getOrNull(): D {
    return this.data
  }

  public getOrUndefined(): D {
    return this.data
  }

  public getError(): E {
    throw new IllegalStateError('Cannot get error of Ok')
  }

  public getErrorOrElse(other: E): E {
    return other
  }

  public getErrorOrNull(): null {
    return null
  }

  public getErrorOrUndefined(): undefined {
    return undefined
  }

  public andThen<T>(map: (data: D) => Result<T, E>): Result<T, E> {
    return map(this.data)
  }

  public map<T>(map: (data: D) => T): Result<T, E> {
    return new Ok(map(this.data))
  }

  public mapError<U>(): Result<D, U> {
    return this as unknown as Result<D, U>
  }
}

export function ok<D, E>(data: D): Result<D, E> {
  return new Ok(data)
}
