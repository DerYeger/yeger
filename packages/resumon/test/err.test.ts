import { describe, expect, it } from 'vitest'

import type { Result } from '../src/index'
import { Err, err, ok } from '../src/index'

describe('Right', () => {
  describe('can be initialized', () => {
    it('using the constructor', () => {
      const res: Result<string, number> = new Err(42)
      expect(res.getError()).toEqual(42)
    })

    it('using the function', () => {
      const res: Result<string, number> = err(42)
      expect(res.getError()).toEqual(42)
    })
  })

  describe('unwraps', () => {
    it('no data', () => {
      const res: Result<string, number> = new Err(42)
      expect(() => res.get()).toThrow('Cannot get data or Err')
      expect(res.getOrUndefined()).toBeUndefined()
      expect(res.getOrNull()).toBeNull()
      expect(res.getOrElse('test')).toEqual('test')
    })

    it('the error', () => {
      const res: Result<string, number> = new Err(42)
      expect(res.getError()).toEqual(42)
      expect(res.getErrorOrUndefined()).toEqual(42)
      expect(res.getErrorOrNull()).toEqual(42)
      expect(res.getErrorOrElse(7)).toEqual(42)
    })
  })

  describe('maps', () => {
    it('no data', () => {
      const res: Result<string, number> = new Err<string, number>(42)
      expect(res.map((data) => `test: ${data}`).getOrNull()).toBeNull()
    })

    it('the error', () => {
      const res: Result<string, number> = new Err(42)
      expect(res.isError).toEqual(true)
      expect(res.mapError((error) => error + 1).getError()).toBe(43)
    })
  })

  describe('chains', () => {
    it('no ok', () => {
      const res: Result<string, number> = new Err(42)
      expect(res.andThen(() => ok('test')).getError()).toEqual(42)
    })

    it('no err', () => {
      const res: Result<string, number> = new Err(42)
      expect(res.andThen(() => err(7)).getError()).toEqual(42)
    })
  })
})
