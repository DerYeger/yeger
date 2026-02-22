import { describe, expect, test } from 'vitest'

import { deepFreeze } from '../src/runtime/utils'

describe('utils', () => {
  describe('deepFreeze', () => {
    test('handles undefined', ({ expect }) => {
      expect(deepFreeze(undefined)).toBeUndefined()
    })

    test.each([
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
