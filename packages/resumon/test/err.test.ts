import { describe, test } from 'vitest'

import type { Result } from '../src/index'
import { Err, err, ok } from '../src/index'

describe('Err', () => {
  describe('can be initialized', () => {
    test('using the constructor', ({ expect }) => {
      const res: Result<string, number> = new Err(42)
      expect(res.getError()).toEqual(42)
    })

    test('using the function', ({ expect }) => {
      const res: Result<string, number> = err(42)
      expect(res.getError()).toEqual(42)
    })
  })

  describe('unwraps', () => {
    test('no data', ({ expect }) => {
      const res: Result<string, number> = new Err(42)
      expect(() => res.get()).toThrow('Cannot get data or Err')
      expect(res.getOrUndefined()).toBeUndefined()
      expect(res.getOrNull()).toBeNull()
      expect(res.getOrElse('test')).toEqual('test')
    })

    test('the error', ({ expect }) => {
      const res: Result<string, number> = new Err(42)
      expect(res.getError()).toEqual(42)
      expect(res.getErrorOrUndefined()).toEqual(42)
      expect(res.getErrorOrNull()).toEqual(42)
      expect(res.getErrorOrElse(7)).toEqual(42)
    })
  })

  describe('maps', () => {
    test('no data', ({ expect }) => {
      const res: Result<string, number> = new Err<string, number>(42)
      expect(res.map((data) => `test: ${data}`).getOrNull()).toBeNull()
    })

    test('the error', ({ expect }) => {
      const res: Result<string, number> = new Err(42)
      expect(res.isError).toEqual(true)
      expect(res.mapError((error) => error + 1).getError()).toBe(43)
    })
  })

  describe('chains', () => {
    test('no ok', ({ expect }) => {
      const res: Result<string, number> = new Err(42)
      expect(res.andThen(() => ok('test')).getError()).toEqual(42)
    })

    test('no err', ({ expect }) => {
      const res: Result<string, number> = new Err(42)
      expect(res.andThen(() => err(7)).getError()).toEqual(42)
    })
  })
})
