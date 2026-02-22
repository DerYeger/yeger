import { describe, test } from 'vitest'

import type { Result } from '../src/index'
import { Ok, err, ok } from '../src/index'

describe('Ok', () => {
  describe('can be initialized', () => {
    test('using the constructor', ({ expect }) => {
      const res: Result<number, string> = new Ok(42)
      expect(res.get()).toEqual(42)
    })

    test('using the function', ({ expect }) => {
      const res: Result<number, string> = ok(42)
      expect(res.get()).toEqual(42)
    })
  })

  describe('unwraps', () => {
    test('the data', ({ expect }) => {
      const res: Result<number, string> = new Ok(42)
      expect(res.get()).toEqual(42)
      expect(res.getOrUndefined()).toEqual(42)
      expect(res.getOrNull()).toEqual(42)
      expect(res.getOrElse(7)).toEqual(42)
    })

    test('no error', ({ expect }) => {
      const res: Result<number, string> = new Ok(42)
      expect(() => res.getError()).toThrow('Cannot get error of Ok')
      expect(res.getErrorOrUndefined()).toBeUndefined()
      expect(res.getErrorOrNull()).toBeNull()
      expect(res.getErrorOrElse('test')).toEqual('test')
    })
  })

  describe('maps', () => {
    test('the data', ({ expect }) => {
      const res: Result<number, string> = new Ok(42)
      expect(res.map((data) => data + 1).get()).toEqual(43)
    })

    test('no error', ({ expect }) => {
      const res: Result<number, string> = new Ok(42)
      expect(res.mapError((error) => `test: ${error}`).getErrorOrNull()).toBeNull()
    })
  })

  describe('chains', () => {
    test('an ok', ({ expect }) => {
      const res: Result<number, string> = new Ok(42)
      expect(res.andThen((data) => ok(data + 1)).get()).toEqual(43)
    })

    test('an err', ({ expect }) => {
      const res: Result<number, string> = new Ok(42)
      expect(res.andThen(() => err('test')).getError()).toEqual('test')
    })
  })
})
