import { describe, test } from 'vitest'

import { WordSplitter } from '../src/word-splitter'

describe('WordSplitter', () => {
  describe('convertHtmlToListOfWords()', () => {
    test('has `convertHtmlToListOfWords', ({ expect }) => {
      expect(typeof WordSplitter.convertHtmlToListOfWords).toBe('function')
    })

    test('accept string as first parameter and returns array', ({ expect }) => {
      expect(Array.isArray(WordSplitter.convertHtmlToListOfWords(''))).toBe(true)
    })

    test('returns words arrays', ({ expect }) => {
      const string = 'this is words'
      const expectedWords = [['this'], ['is'], ['words']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('divide numbers', ({ expect }) => {
      const string = '12345'
      const expectedWords = [['1'], ['2'], ['3'], ['4'], ['5']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('numbers and tags', ({ expect }) => {
      const string = '12345<img src="123" />'
      const expectedWords = [['1'], ['2'], ['3'], ['4'], ['5'], ['<img src="123" />']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('numbers and entities', ({ expect }) => {
      const string = '123&entity'
      const expectedWords = [['1'], ['2'], ['3'], ['&entity']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('numbers and characters and whitespaces', ({ expect }) => {
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

    test('entities and whitespace', ({ expect }) => {
      const string = ' &entity  '
      const expectedWords = [[' '], ['&entity'], ['  ']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('character and entities', ({ expect }) => {
      const string = ' [&entity]'
      const expectedWords = [['['], ['&entity'], [']']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('returns spaces', ({ expect }) => {
      const string = 'this is words' // 2 spaces
      const expectedWords = [[' '], [' ']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('returns elements in original order', ({ expect }) => {
      const string = 'this is words'
      const expectedWords = [['this'], [' '], ['is'], [' '], ['words']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('returns punctuation', ({ expect }) => {
      const string = 'text; words.?,'
      const expectedWords = [[';'], ['.'], ['?'], [',']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('returns characters', ({ expect }) => {
      const string = '[text]'
      const expectedWords = [['['], ['text'], [']']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('returns opening and closing tags', ({ expect }) => {
      const string = '<tag>some text </tag>'
      const expectedWords = [['<tag>'], ['</tag>']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('returns singleton tags', ({ expect }) => {
      const string = '<audio /> <video /> '
      const expectedWords = [['<audio />'], ['<video />']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('returns tags with attributes', ({ expect }) => {
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

    test('returns entities', ({ expect }) => {
      const string = '&entity; &other'
      const expectedWords = [['&entity;'], ['&other']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('returns entities with right borders (delimiter - ";")', ({ expect }) => {
      const string = '&entity;notEntityPart'
      const expectedWords = [['&entity;']]
      expect(WordSplitter.convertHtmlToListOfWords(string)).toEqual(
        expect.arrayContaining(expectedWords),
      )
    })

    test('difficult string with (tags, entities, numbers, characters, words, ect.)', ({
      expect,
    }) => {
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

    test('works with blockExpressions', ({ expect }) => {
      const stringWithDate = '19.02.2022 and other words'
      const blockExp = { exp: /\d\d.\d\d.\d\d\d\d/g }
      const expectedDates = [['19.02.2022']]
      expect(WordSplitter.convertHtmlToListOfWords(stringWithDate, [blockExp])).toEqual(
        expect.arrayContaining(expectedDates),
      )
    })

    test('works with multiple blockExpressions', ({ expect }) => {
      const stringWithDate = '19.02.2022 11-12-2022'
      const blockExp = { exp: /\d\d\.\d\d\.\d\d\d\d/g }
      const blockExp2 = { exp: /\d\d-\d\d-\d\d\d\d/g }
      const expectedDates = [['19.02.2022'], [' '], ['11-12-2022']]
      expect(WordSplitter.convertHtmlToListOfWords(stringWithDate, [blockExp, blockExp2])).toEqual(
        expect.arrayContaining(expectedDates),
      )
    })

    test(`will return first - match from (blockExp.compareBy) from
            second - part of the text from (blockExp.exp) match`, ({ expect }) => {
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

    test('when blockExpressions cross each other - will not throw an error', ({ expect }) => {
      const stringWithDate = '19.02.2022 and other words'
      const blockExp = { exp: /\d\d.\d\d.\d\d\d\d/g }
      const blockExp2 = { exp: /\d\d.\d\d.\d\d\d\d/g }
      expect(() =>
        WordSplitter.convertHtmlToListOfWords(stringWithDate, [blockExp, blockExp2]),
      ).not.toThrowError()
    })
  })
})
