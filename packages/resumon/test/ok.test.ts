import { describe, expect, it } from 'vitest'

import type { Result } from '~/main'
import { Ok, err, ok } from '~/main'

describe.concurrent('Left', () => {
  describe('can be initialized', () => {
    it('using the constructor', () => {
      const res: Result<number, string> = new Ok(42)
      expect(res.get()).toEqual(42)
    })

    it('using the function', () => {
      const res: Result<number, string> = ok(42)
      expect(res.get()).toEqual(42)
    })
  })

  describe('unwraps', () => {
    it('the data', () => {
      const res: Result<number, string> = new Ok(42)
      expect(res.get()).toEqual(42)
      expect(res.getOrUndefined()).toEqual(42)
      expect(res.getOrNull()).toEqual(42)
      expect(res.getOrElse(7)).toEqual(42)
    })

    it('no error', () => {
      const res: Result<number, string> = new Ok(42)
      expect(() => res.getError()).toThrow('Cannot get error of Ok')
      expect(res.getErrorOrUndefined()).toBeUndefined()
      expect(res.getErrorOrNull()).toBeNull()
      expect(res.getErrorOrElse('test')).toEqual('test')
    })
  })

  describe('maps', () => {
    it('the data', () => {
      const res: Result<number, string> = new Ok(42)
      expect(res.map((data) => data + 1).get()).toEqual(43)
    })

    it('no error', () => {
      const res: Result<number, string> = new Ok(42)
      expect(
        res.mapError((error) => `test: ${error}`).getErrorOrNull(),
      ).toBeNull()
    })
  })

  describe('chains', () => {
    it('an ok', () => {
      const res: Result<number, string> = new Ok(42)
      expect(res.andThen((data) => ok(data + 1)).get()).toEqual(43)
    })

    it('an err', () => {
      const res: Result<number, string> = new Ok(42)
      expect(res.andThen(() => err('test')).getError()).toEqual('test')
    })
  })
})
