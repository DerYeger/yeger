import { describe, expect, it } from 'vitest'
import * as Utils from '../src/utils'

describe('Utils', () => {
  describe('isTag()', () => {
    it('exist', () => {
      expect(typeof Utils.isTag).toBe('function')
    })

    it('accept string and return true if it is tag', () => {
      expect(Utils.isTag('')).toBe(false)

      expect(Utils.isTag('<span>')).toBe(true)
      expect(Utils.isTag('<video />')).toBe(true)
    })

    it('if it is "<img" tag - return false', () => {
      expect(Utils.isTag('<img />')).toBe(false)
    })
  })

  describe('stripTagAttributes()', () => {
    it('exist', () => {
      expect(typeof Utils.stripTagAttributes).toBe('function')
    })

    it('accept string and return stript tag - without any attributes', () => {
      expect(Utils.stripTagAttributes('')).toBe('>')

      expect(
        Utils.stripTagAttributes('<span class="bold" style="font-size: 8px;" id="id-1" >'),
      ).toBe('<span>')
      expect(Utils.stripTagAttributes('<img src="./image-1.png" />')).toBe('<img/>')
    })
  })

  describe('wrapText()', () => {
    it('exist', () => {
      expect(typeof Utils.wrapText).toBe('function')
    })

    it('create tag with passed text inside', () => {
      expect(Utils.wrapText('text', 'span', '')).toBe('<span class="">text</span>')
    })

    it('set passed css class to tag ', () => {
      expect(Utils.wrapText('text', 'span', 'bold')).toBe(
        '<span class="bold">text</span>',
      )
    })
  })
  describe('isStartOfTag()', () => {
    it('exist', () => {
      expect(typeof Utils.isStartOfTag).toBe('function')
    })

    it('return true if it is start of the tag', () => {
      expect(Utils.isStartOfTag('')).toBe(false)
      expect(Utils.isStartOfTag('>')).toBe(false)

      expect(Utils.isStartOfTag('<')).toBe(true)
    })
  })

  describe('isEndOfTag()', () => {
    it('exist', () => {
      expect(typeof Utils.isEndOfTag).toBe('function')
    })

    it('return true if it is end of the tag', () => {
      expect(Utils.isEndOfTag('')).toBe(false)
      expect(Utils.isEndOfTag('<')).toBe(false)

      expect(Utils.isEndOfTag('>')).toBe(true)
    })
  })

  describe('isStartOfEntity()', () => {
    it('exist', () => {
      expect(typeof Utils.isStartOfEntity).toBe('function')
    })

    it('return true if it is start of the entity', () => {
      expect(Utils.isStartOfEntity('')).toBe(false)
      expect(Utils.isStartOfEntity('<')).toBe(false)

      expect(Utils.isStartOfEntity('&')).toBe(true)
    })
  })

  describe('isEndOfEntity()', () => {
    it('exist', () => {
      expect(typeof Utils.isEndOfEntity).toBe('function')
    })

    it('return true if it is end of the entity', () => {
      expect(Utils.isEndOfEntity('')).toBe(false)
      expect(Utils.isEndOfEntity('<')).toBe(false)

      expect(Utils.isEndOfEntity(';')).toBe(true)
    })
  })

  describe('isWhiteSpace()', () => {
    it('exist', () => {
      expect(typeof Utils.isWhiteSpace).toBe('function')
    })

    it('return true if it is whitespace', () => {
      expect(Utils.isWhiteSpace('')).toBe(false)
      expect(Utils.isWhiteSpace('<')).toBe(false)

      expect(Utils.isWhiteSpace(' ')).toBe(true)
      expect(Utils.isWhiteSpace('&nbsp;')).toBe(true)
    })
  })

  describe('stripAnyAttributes()', () => {
    it('exist', () => {
      expect(typeof Utils.stripAnyAttributes).toBe('function')
    })

    it('if passed tag - strip attributes otherwise return same string', () => {
      expect(Utils.stripAnyAttributes('<tag attribute="value" />')).toBe('<tag/>')
      expect(Utils.stripAnyAttributes('word')).toBe('word')
    })
  })

  describe('isNumber()', () => {
    it('exist', () => {
      expect(typeof Utils.isNumber).toBe('function')
    })

    it('return true if it is number', () => {
      expect(Utils.isNumber('b')).toBe(false)
      expect(Utils.isNumber('[')).toBe(false)
      expect(Utils.isNumber(' ')).toBe(false)

      expect(Utils.isNumber('1')).toBe(true)
      expect(Utils.isNumber('9')).toBe(true)
    })
  })

  describe('isWord()', () => {
    it('exist', () => {
      expect(typeof Utils.isWord).toBe('function')
    })

    it('return true if it is number', () => {
      expect(Utils.isWord('+')).toBe(false)
      expect(Utils.isWord('[')).toBe(false)
      expect(Utils.isWord(';')).toBe(false)

      expect(Utils.isWord('a')).toBe(true)
      expect(Utils.isWord('b')).toBe(true)
    })
  })
})
