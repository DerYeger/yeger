import { describe, test } from 'vitest'

import { HtmlDiff } from '../src/html-diff'
import { Match } from '../src/match'
import type { Operation } from '../src/types'

describe('WordSplitter', () => {
  describe('splitInputsIntoWords()', () => {
    test('split oldText and newText into words`', ({ expect }) => {
      const htmlDiff = new HtmlDiff('old words', 'new text')
      htmlDiff.splitInputsIntoWords()

      expect(htmlDiff.oldWords).toEqual(['old', ' ', 'words'])
      expect(htmlDiff.newWords).toEqual(['new', ' ', 'text'])
    })
  })

  describe('findMatch()', () => {
    test('if found match - return it', ({ expect }) => {
      const htmlDiff = new HtmlDiff('same text', 'new text') // " text" - is match

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4 // block size for search

      const expectedMatch = new Match(1, 1, 2)

      expect(
        htmlDiff.findMatch({
          startInOld: 0,
          endInOld: htmlDiff.oldWords.length,
          startInNew: 0,
          endInNew: htmlDiff.newWords.length,
        }),
      ).toEqual(expectedMatch)
    })

    test('if did not find match - return null', ({ expect }) => {
      const htmlDiff = new HtmlDiff('same text', 'new-words') // no matches

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4 // block size for search

      expect(
        htmlDiff.findMatch({
          startInOld: 0,
          endInOld: htmlDiff.oldWords.length,
          startInNew: 0,
          endInNew: htmlDiff.newWords.length,
        }),
      ).toEqual(null)
    })

    test('startInOld and startInNew - will start search in old and new text from specified position', ({
      expect,
    }) => {
      const htmlDiff = new HtmlDiff('new words', 'new text') // "new " - is match

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4 // you can say it's biggest block size

      expect(
        htmlDiff.findMatch({
          startInOld: 2, // start from 3th word
          endInOld: htmlDiff.oldWords.length,
          startInNew: 2, // start from 3th word
          endInNew: htmlDiff.newWords.length,
        }),
      ).toEqual(null) // find nothing because on 3th position isn't any matches
    })

    test('endInOld and endInNew - will end search in old and new text on specified position', ({
      expect,
    }) => {
      const htmlDiff = new HtmlDiff('new text', 'old text') // " text" - is match

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4 // you can say it's biggest block size

      expect(
        htmlDiff.findMatch({
          startInOld: 0,
          endInOld: 1, // end search on 2th word
          startInNew: 0,
          endInNew: 1, // end search on 2th word
        }),
      ).toEqual(null) // find nothing
    })
  })

  describe('matchingBlocks()', () => {
    test('find all matches in phrase', ({ expect }) => {
      const htmlDiff = new HtmlDiff('new text other words', 'old text any words') // " text ", " words" - is matches

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4 // you can say it's biggest block size

      const matches = [
        new Match(1, 1, 3), // " text " match
        new Match(5, 5, 2), // " words" match
      ]

      expect(htmlDiff.matchingBlocks()).toEqual(matches)
    })
  })
  describe('operations() - return list of all modifications thats happened in new version', () => {
    test('equal', ({ expect }) => {
      const htmlDiff = new HtmlDiff('new words', 'new words')

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4

      const operations: Operation[] = [
        {
          action: 'equal',
          startInOld: 0,
          startInNew: 0,
          endInOld: 3,
          endInNew: 3,
        },
      ]

      expect(htmlDiff.operations()).toEqual(operations)
    })

    test('deletion', ({ expect }) => {
      const htmlDiff = new HtmlDiff('new words', 'new') // " words" - deletion

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4 // you can say it's biggest block size

      const operations: Operation[] = [
        {
          action: 'equal',
          startInOld: 0,
          startInNew: 0,
          endInOld: 1,
          endInNew: 1,
        },
        {
          action: 'delete',
          startInOld: 1,
          startInNew: 1,
          endInOld: 3,
          endInNew: 1,
        },
      ]

      expect(htmlDiff.operations()).toEqual(operations)
    })
    test('insertion', ({ expect }) => {
      const htmlDiff = new HtmlDiff('new words', 'new words added') // " added" - insertion

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4 // you can say it's biggest block size

      const operations: Operation[] = [
        {
          action: 'equal',
          startInOld: 0,
          startInNew: 0,
          endInOld: 3,
          endInNew: 3,
        },
        {
          action: 'insert',
          startInOld: 3,
          startInNew: 3,
          endInOld: 3,
          endInNew: 5,
        },
      ]

      expect(htmlDiff.operations()).toEqual(operations)
    })

    test('replacement', ({ expect }) => {
      const htmlDiff = new HtmlDiff('new words', 'new phrase') // " added" - insertion

      htmlDiff.splitInputsIntoWords()
      htmlDiff.matchGranularity = 4 // you can say it's biggest block size

      const operations: Operation[] = [
        {
          action: 'equal',
          startInOld: 0,
          startInNew: 0,
          endInOld: 2,
          endInNew: 2,
        },
        {
          action: 'replace',
          startInOld: 2,
          startInNew: 2,
          endInOld: 3,
          endInNew: 3,
        },
      ]

      expect(htmlDiff.operations()).toEqual(operations)
    })
  })

  describe('insertTag() - accept tag name and className and list of words; write to content field tag with passed words inside', () => {
    test('insert tag with passed words to content field', ({ expect }) => {
      const htmlDiff = new HtmlDiff('', '')
      htmlDiff.insertTag('ins', '', ['this', ' ', 'is', ' ', 'words'])
      expect(htmlDiff.content).toEqual(['<ins class="">this is words</ins>'])
    })

    test('set class to tag', ({ expect }) => {
      const htmlDiff = new HtmlDiff('', '')
      htmlDiff.insertTag('ins', 'className', ['word'])
      expect(htmlDiff.content).toEqual(['<ins class="className">word</ins>'])
    })

    test('if there is tags inside - will put them before new tag', ({ expect }) => {
      const htmlDiff = new HtmlDiff('', '')
      htmlDiff.insertTag('ins', '', ['<strong>', 'text', ' ', 'inside', '</strong>'])
      expect(htmlDiff.content).toEqual(['<strong><ins class="">text inside</ins></strong>'])
    })

    test('works with multiple tags inside', ({ expect }) => {
      const htmlDiff = new HtmlDiff('', '')
      htmlDiff.insertTag('ins', '', ['<strong>', 'text', '</strong>', '<b>', 'inside', '</b>'])
      expect(htmlDiff.content).toEqual([
        '<strong><ins class="">text</ins></strong><b><ins class="">inside</ins></b>',
      ])
    })

    test('expect img tags - will put them inside the tag', ({ expect }) => {
      const htmlDiff = new HtmlDiff('', '')
      htmlDiff.insertTag('ins', '', ['<strong>', '<img />', 'text', '</strong>'])
      expect(htmlDiff.content).toEqual(['<strong><ins class=""><img />text</ins></strong>'])
    })
  })
})
