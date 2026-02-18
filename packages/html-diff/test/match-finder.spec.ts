import { describe, expect, it } from 'vitest'

import { Match } from '../src/match'
import { MatchFinder } from '../src/match-finder'

describe('WordSplitter', () => {
  describe('indexNewWords()', () => {
    it('indexing newWords by block size', () => {
      const finder = new MatchFinder({
        oldWords: [],
        newWords: ['this', ' ', 'is', ' ', 'new', ' ', 'text'],
        startInOld: 0,
        endInOld: 0,
        startInNew: 0,
        endInNew: 7,
        options: {
          blockSize: 3,
          ignoreWhitespaceDifferences: false,
          repeatingWordsAccuracy: 1.0,
        },
      })

      finder.indexNewWords()

      const expectedWorldIndices = new Map<string, number[]>()
      expectedWorldIndices.set('this is', [2])
      expectedWorldIndices.set(' is ', [3])
      expectedWorldIndices.set('is new', [4])
      expectedWorldIndices.set(' new ', [5])
      expectedWorldIndices.set('new text', [6])

      expect(finder.wordIndices).toEqual(expectedWorldIndices)
    })
    it('when words overlap - will put indices of them into one element', () => {
      const finder = new MatchFinder({
        oldWords: [],
        newWords: ['this', ' ', 'is', ' ', 'this', ' ', 'is'], // "this is" - repeating twice
        startInOld: 0,
        endInOld: 7,
        startInNew: 0,
        endInNew: 7,
        options: {
          blockSize: 3,
          ignoreWhitespaceDifferences: false,
          repeatingWordsAccuracy: 1.0,
        },
      })

      finder.indexNewWords()

      const expectedWorldIndices = new Map<string, number[]>()
      expectedWorldIndices.set('this is', [2, 6]) // overlap - "this is" sentence found twice
      expectedWorldIndices.set(' is ', [3])
      expectedWorldIndices.set('is this', [4])
      expectedWorldIndices.set(' this ', [5])

      expect(finder.wordIndices).toEqual(expectedWorldIndices)
    })
  })

  describe('normalizeForIndex()', () => {
    it('strip any attributes from tags', () => {
      const finder = new MatchFinder({
        oldWords: [],
        newWords: [],
        startInOld: 0,
        endInOld: 0,
        startInNew: 0,
        endInNew: 7,
        options: {
          blockSize: 3,
          ignoreWhitespaceDifferences: false,
          repeatingWordsAccuracy: 1.0,
        },
      })

      const word = "<tag attribute='value' />"

      expect(finder.normalizeForIndex(word)).toEqual('<tag/>')
    })

    it('when has option - ignoreWhitespaceDifferences - will return only one space if passed many whitespaces', () => {
      const finder = new MatchFinder({
        oldWords: [],
        newWords: [],
        startInOld: 0,
        endInOld: 0,
        startInNew: 0,
        endInNew: 7,
        options: {
          blockSize: 3,
          ignoreWhitespaceDifferences: true, // set this to true
          repeatingWordsAccuracy: 1.0,
        },
      })

      const word = '     '

      expect(finder.normalizeForIndex(word)).toEqual(' ') // return only one whitespace
    })
  })
  describe('removeRepeatingWords()', () => {
    it('removes words from wordIndices that are found more than threshold times (which is newWorlds length + repeatingWordsAccuracy)', () => {
      const finder = new MatchFinder({
        oldWords: [''],
        newWords: ['this', 'this', 'this', 'this', 'this', 'this'],
        startInOld: 0,
        endInOld: 0,
        startInNew: 0,
        endInNew: 6,
        options: {
          blockSize: 3,
          ignoreWhitespaceDifferences: false,
          repeatingWordsAccuracy: -5,
        },
      })

      const expectedWorldIndices = new Map() // will be empty

      finder.indexNewWords()
      finder.removeRepeatingWords()

      expect(finder.wordIndices).toEqual(expectedWorldIndices)
    })
  })
  describe('findMatch()', () => {
    it("if matches weren't found - return null", () => {
      const oldWords = ['this', ' ', 'is', ' ', 'old', ' ', 'text']
      const newWords = ['different', 'words', 'here']
      const finder = new MatchFinder({
        oldWords,
        newWords,
        startInOld: 0,
        endInOld: oldWords.length,
        startInNew: 0,
        endInNew: newWords.length,
        options: {
          blockSize: 3,
          ignoreWhitespaceDifferences: false,
          repeatingWordsAccuracy: 1.0,
        },
      })

      expect(finder.findMatch()).toEqual(null)
    })

    it('find matches in two sequences of words and return Match (its position in old sequence and new one, and size)', () => {
      const oldWords = ['this', ' ', 'is', ' ', 'old', ' ', 'text']
      const newWords = ['this', ' ', 'is', ' ', 'new', ' ', 'text']
      const finder = new MatchFinder({
        oldWords,
        newWords,
        startInOld: 0,
        endInOld: oldWords.length, // will check all text from start to finish
        startInNew: 0,
        endInNew: newWords.length, // will check all text from start to finish
        options: {
          blockSize: 4,
          ignoreWhitespaceDifferences: false,
          repeatingWordsAccuracy: 1.0,
        },
      })

      const expectedMatch = new Match(0, 0, 4)

      expect(finder.findMatch()).toEqual(expectedMatch) // will return that sequence - "this is " is the same in old and new
    })

    it(`if you reduce block size and change pointers (starts and ends in old and new)
            - it will return more precise positions which could be skipped in first runthrough`, () => {
      const finder = new MatchFinder({
        oldWords: ['this', ' ', 'is', ' ', 'old', ' ', 'text'],
        newWords: ['this', ' ', 'is', ' ', 'new', ' ', 'text'],
        startInOld: 4, // we change pointers for it to look only part of the text
        endInOld: 7,
        startInNew: 4, // we change pointers for it to look only part of the text
        endInNew: 7,
        options: {
          blockSize: 2, // we change block size in order to notice smaller changes
          ignoreWhitespaceDifferences: false,
          repeatingWordsAccuracy: 1.0,
        },
      })

      const expectedMatch = new Match(5, 5, 2)

      expect(finder.findMatch()).toEqual(expectedMatch) // will return that sequence - " text" is the same in old and new
    })

    it(`when have repeating sentences will return all sentence`, () => {
      const oldWords = ['this', ' ', 'is', ' ', 'this', ' ', 'is']
      const newWords = ['this', ' ', 'is', ' ', 'this', ' ', 'is']
      const finder = new MatchFinder({
        oldWords,
        newWords,
        startInOld: 0,
        endInOld: oldWords.length,
        startInNew: 0,
        endInNew: newWords.length,
        options: {
          blockSize: 2,
          ignoreWhitespaceDifferences: false,
          repeatingWordsAccuracy: 1.0,
        },
      })

      const expectedMatch = new Match(0, 0, 7)

      expect(finder.findMatch()).toEqual(expectedMatch) // will return that all sequence - "this is this is" is the same in old and new
    })
  })
})
