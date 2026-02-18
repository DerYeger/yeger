import { describe, expect, it } from 'vitest'

import { WordSplitter } from '../src/word-splitter'

describe('WordSplitter', () => {
  describe('convertHtmlToListOfWords()', () => {
    it('has `convertHtmlToListOfWords', () => {
      expect(typeof WordSplitter.convertHtmlToListOfWords).toBe('function')
    })

    it('accept string as first parameter and returns array', () => {
      expect(Array.isArray(WordSplitter.convertHtmlToListOfWords(''))).toBe(true)
    })

    it('returns words arrays', () => {
      const string = 'this is words'
      const expectedWords = [['this'], ['is'], ['words']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('divide numbers', () => {
      const string = '12345'
      const expectedWords = [['1'], ['2'], ['3'], ['4'], ['5']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('numbers and tags', () => {
      const string = '12345<img src="123" />'
      const expectedWords = [['1'], ['2'], ['3'], ['4'], ['5'], ['<img src="123" />']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('numbers and entities', () => {
      const string = '123&entity'
      const expectedWords = [['1'], ['2'], ['3'], ['&entity']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('numbers and characters and whitespaces', () => {
      const string = '123[] 123 '
      const expectedWords = [
        ['1'],
        ['2'],
        ['3'],
        [' '],
        ['['],
        [']'],
        [' '],
        ['1'],
        ['2'],
        ['3'],
        [' '],
      ]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('entities and whitespace', () => {
      const string = ' &entity  '
      const expectedWords = [[' '], ['&entity'], ['  ']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('character and entities', () => {
      const string = ' [&entity]'
      const expectedWords = [['['], ['&entity'], [']']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('returns spaces', () => {
      const string = 'this is words' // 2 spaces
      const expectedWords = [[' '], [' ']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('returns elements in original order', () => {
      const string = 'this is words'
      const expectedWords = [['this'], [' '], ['is'], [' '], ['words']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('returns punctuation', () => {
      const string = 'text; words.?,'
      const expectedWords = [[';'], ['.'], ['?'], [',']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('returns characters', () => {
      const string = '[text]'
      const expectedWords = [['['], ['text'], [']']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('returns opening and closing tags', () => {
      const string = '<tag>some text </tag>'
      const expectedWords = [['<tag>'], ['</tag>']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('returns singleton tags', () => {
      const string = '<audio /> <video /> '
      const expectedWords = [['<audio />'], ['<video />']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('returns tags with attributes', () => {
      const string = '<tag attribute="value1" >some text </tag>'
      const expectedWords = [['<tag attribute="value1" >'], ['</tag>']]

      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )

      const hardString = '<tag style="font-weight: 500; &font-face:"Roboto";" >some text </tag>'
      const expectedWords2 = [['<tag style="font-weight: 500; &font-face:"Roboto";" >'], ['</tag>']]

      expect(WordSplitter.convertHtmlToListOfWords(hardString)).toEqual(
        expect.arrayContaining(expectedWords2),
      )
    })

    it('returns entities', () => {
      const string = '&entity; &other'
      const expectedWords = [['&entity;'], ['&other']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('returns entities with right borders (delimiter - ";")', () => {
      const string = '&entity;notEntityPart'
      const expectedWords = [['&entity;']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('difficult string with (tags, entities, numbers, characters, words, ect.)', () => {
      const string = '&en; ~  ~1 ~word &<>  <>&1 & '
      const expectedWords = [
        ['&en;'],
        [' '],
        ['~'],
        ['  '],
        ['~'],
        ['1'],
        [' '],
        ['~'],
        ['word'],
        [' '],
        ['&'],
        ['<>'],
        ['  '],
        ['<>'],
        ['&'],
        ['1'],
        [' '],
        ['&'],
        [' '],
      ]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(expectedWords)
    })

    it('works with blockExpressions', () => {
      const stringWithDate = '19.02.2022 and other words'
      const blockExp = { exp: /\d\d.\d\d.\d\d\d\d/g }
      const expectedDates = [['19.02.2022']]
      expect(WordSplitter.convertHtmlToListOfWords(stringWithDate, [blockExp])).toEqual(
        expect.arrayContaining(expectedDates),
      )
    })

    it('works with multiple blockExpressions', () => {
      const stringWithDate = '19.02.2022 11-12-2022'
      const blockExp = { exp: /\d\d\.\d\d\.\d\d\d\d/g }
      const blockExp2 = { exp: /\d\d-\d\d-\d\d\d\d/g }
      const expectedDates = [['19.02.2022'], [' '], ['11-12-2022']]
      expect(WordSplitter.convertHtmlToListOfWords(stringWithDate, [blockExp, blockExp2])).toEqual(
        expect.arrayContaining(expectedDates),
      )
    })
    it(`will return first - match from (blockExp.compareBy) from
            second - part of the text from (blockExp.exp) match`, () => {
      const stringWithDate = '  <img src="./image.png" title="title-1" />other'
      const blockExp = {
        exp: /<img[\s\S]+?\/>/g,
        compareBy: /title="[\s\S]+?"/g,
      }
      const expectedWords = [
        ['  '],
        [
          'title="title-1"', // first - match from blockExp.compareBy
          '<img src="./image.png" title="title-1" />', // second - part of the text from blockExp.exp match
        ],
        ['other'],
      ]
      expect(WordSplitter.convertHtmlToListOfWords(stringWithDate, [blockExp])).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    it('when blockExpressions cross each other - will not throw an error', () => {
      const stringWithDate = '19.02.2022 and other words'
      const blockExp = { exp: /\d\d.\d\d.\d\d\d\d/g }
      const blockExp2 = { exp: /\d\d.\d\d.\d\d\d\d/g }
      expect(() =>
        WordSplitter.convertHtmlToListOfWords(stringWithDate, [blockExp, blockExp2]),
      ).not.toThrowError()
    })
  })
})
