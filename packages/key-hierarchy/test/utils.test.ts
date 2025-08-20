import { describe, expect, it } from 'vitest'
import { deepFreeze } from '~/runtime/utils'

describe('utils', () => {
  describe('deepFreeze', () => {
    it('handles undefined', () => {
      expect(deepFreeze(undefined)).toBeUndefined()
    })

    it.each([
      ['null', null],
      ['undefined', undefined],
      ['true', true],
      ['false', false],
      ['0', 0],
      ['1', 1],
      ['string', 'string'],
      ['symbol', Symbol('symbol')],
      ['function', () => {}],
      ['date', new Date()],
      ['map', new Map()],
      ['set', new Set()],
      ['array', Array.from({ length: 5 })],
      ['object', Object.create(null)],
    ])('handles %s', (_, input) => {
      expect(deepFreeze(input)).toBe(input)
    })
  })
})
