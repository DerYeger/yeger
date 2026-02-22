import { describe, test } from 'vitest'

import * as Utils from '../src/utils'

describe('Utils', () => {
  describe('isTag()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.isTag).toBe('function')
    })

    test('accept string and return true if it is tag', ({ expect }) => {
      expect(Utils.isTag('')).toBe(false)

      expect(Utils.isTag('<span>')).toBe(true)
      expect(Utils.isTag('<video />')).toBe(true)
    })

    test('if it is "<img" tag - return false', ({ expect }) => {
      expect(Utils.isTag('<img />')).toBe(false)
    })
  })

  describe('stripTagAttributes()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.stripTagAttributes).toBe('function')
    })

    test('accept string and return stript tag - without any attributes', ({ expect }) => {
      expect(Utils.stripTagAttributes('')).toBe('>')

      expect(
        Utils.stripTagAttributes('<span class="bold" style="font-size: 8px;" id="id-1" >'),
      ).toBe('<span>')
      expect(Utils.stripTagAttributes('<img src="./image-1.png" />')).toBe('<img/>')
    })
  })

  describe('wrapText()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.wrapText).toBe('function')
    })

    test('create tag with passed text inside', ({ expect }) => {
      expect(Utils.wrapText('text', 'span', '')).toBe('<span class="">text</span>')
    })

    test('set passed css class to tag', ({ expect }) => {
      expect(Utils.wrapText('text', 'span', 'bold')).toBe('<span class="bold">text</span>')
    })
  })
  describe('isStartOfTag()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.isStartOfTag).toBe('function')
    })

    test('return true if it is start of the tag', ({ expect }) => {
      expect(Utils.isStartOfTag('')).toBe(false)
      expect(Utils.isStartOfTag('>')).toBe(false)

      expect(Utils.isStartOfTag('<')).toBe(true)
    })
  })

  describe('isEndOfTag()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.isEndOfTag).toBe('function')
    })

    test('return true if it is end of the tag', ({ expect }) => {
      expect(Utils.isEndOfTag('')).toBe(false)
      expect(Utils.isEndOfTag('<')).toBe(false)

      expect(Utils.isEndOfTag('>')).toBe(true)
    })
  })

  describe('isStartOfEntity()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.isStartOfEntity).toBe('function')
    })

    test('return true if it is start of the entity', ({ expect }) => {
      expect(Utils.isStartOfEntity('')).toBe(false)
      expect(Utils.isStartOfEntity('<')).toBe(false)

      expect(Utils.isStartOfEntity('&')).toBe(true)
    })
  })

  describe('isEndOfEntity()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.isEndOfEntity).toBe('function')
    })

    test('return true if it is end of the entity', ({ expect }) => {
      expect(Utils.isEndOfEntity('')).toBe(false)
      expect(Utils.isEndOfEntity('<')).toBe(false)

      expect(Utils.isEndOfEntity(';')).toBe(true)
    })
  })

  describe('isWhiteSpace()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.isWhiteSpace).toBe('function')
    })

    test('return true if it is whitespace', ({ expect }) => {
      expect(Utils.isWhiteSpace('')).toBe(false)
      expect(Utils.isWhiteSpace('<')).toBe(false)

      expect(Utils.isWhiteSpace(' ')).toBe(true)
      expect(Utils.isWhiteSpace('&nbsp;')).toBe(true)
    })
  })

  describe('stripAnyAttributes()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.stripAnyAttributes).toBe('function')
    })

    test('if passed tag - strip attributes otherwise return same string', ({ expect }) => {
      expect(Utils.stripAnyAttributes('<tag attribute="value" />')).toBe('<tag/>')
      expect(Utils.stripAnyAttributes('word')).toBe('word')
    })
  })

  describe('isNumber()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.isNumber).toBe('function')
    })

    test('return true if it is number', ({ expect }) => {
      expect(Utils.isNumber('b')).toBe(false)
      expect(Utils.isNumber('[')).toBe(false)
      expect(Utils.isNumber(' ')).toBe(false)

      expect(Utils.isNumber('1')).toBe(true)
      expect(Utils.isNumber('9')).toBe(true)
    })
  })

  describe('isWord()', () => {
    test('exist', ({ expect }) => {
      expect(typeof Utils.isWord).toBe('function')
    })

    test('return true if it is word', ({ expect }) => {
      expect(Utils.isWord('+')).toBe(false)
      expect(Utils.isWord('[')).toBe(false)
      expect(Utils.isWord(';')).toBe(false)

      expect(Utils.isWord('a')).toBe(true)
      expect(Utils.isWord('b')).toBe(true)
    })
  })
})
