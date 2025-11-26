import { Match } from './match'
import type { MatchOptions } from './types'
import { isWhiteSpace, stripAnyAttributes } from './utils'

function putNewWord(block: string[], word: string, blockSize: number) {
  block.push(word)

  if (block.length > blockSize) {
    block.shift()
  }

  if (block.length !== blockSize) {
    return null
  }

  return block.join('')
}

interface Props {
  oldWords: string[]
  newWords: string[]
  startInOld: number
  endInOld: number
  startInNew: number
  endInNew: number
  options: MatchOptions
}

// Finds the longest match in given texts. It uses indexing with fixed granularity that is used to compare blocks of text.
export class MatchFinder {
  private oldWords: string[]
  private newWords: string[]
  private startInOld: number
  private endInOld: number
  private startInNew: number
  private endInNew: number
  private options: MatchOptions

  public wordIndices: Map<string, number[]>

  public constructor({
    oldWords,
    newWords,
    startInOld,
    endInOld,
    startInNew,
    endInNew,
    options,
  }: Props) {
    this.oldWords = oldWords
    this.newWords = newWords
    this.startInOld = startInOld
    this.endInOld = endInOld
    this.startInNew = startInNew
    this.endInNew = endInNew
    this.options = options
    this.wordIndices = new Map()
  }

  public indexNewWords(): void {
    this.wordIndices = new Map()
    const block: string[] = []
    for (let i = this.startInNew; i < this.endInNew; i++) {
      // if word is a tag, we should ignore attributes as attribute changes are not supported (yet)
      const word = this.normalizeForIndex(this.newWords[i]!)
      const key = putNewWord(block, word, this.options.blockSize)

      if (key === null) {
        continue
      }

      if (this.wordIndices.has(key)) {
        this.wordIndices.get(key)!.push(i)
      } else {
        this.wordIndices.set(key, [i])
      }
    }
  }

  // Converts the word to index-friendly value so it can be compared with other similar words
  public normalizeForIndex(word: string): string {
    word = stripAnyAttributes(word)
    if (this.options.ignoreWhitespaceDifferences && isWhiteSpace(word)) {
      return ' '
    }

    return word
  }

  public findMatch(): Match | null {
    this.indexNewWords()
    this.removeRepeatingWords()

    if (this.wordIndices.size === 0) {
      return null
    }

    let bestMatchInOld = this.startInOld
    let bestMatchInNew = this.startInNew
    let bestMatchSize = 0

    let matchLengthAt = new Map()
    const blockSize = this.options.blockSize
    const block: string[] = []

    for (let indexInOld = this.startInOld; indexInOld < this.endInOld; indexInOld++) {
      const word = this.normalizeForIndex(this.oldWords[indexInOld]!)
      const index = putNewWord(block, word, blockSize)

      if (index === null) {
        continue
      }

      const newMatchLengthAt = new Map()

      if (!this.wordIndices.has(index)) {
        matchLengthAt = newMatchLengthAt
        continue
      }

      for (const indexInNew of this.wordIndices.get(index)!) {
        const newMatchLength =
          (matchLengthAt.has(indexInNew - 1) ? matchLengthAt.get(indexInNew - 1) : 0) + 1
        newMatchLengthAt.set(indexInNew, newMatchLength)

        if (newMatchLength > bestMatchSize) {
          bestMatchInOld = indexInOld - newMatchLength - blockSize + 2
          bestMatchInNew = indexInNew - newMatchLength - blockSize + 2
          bestMatchSize = newMatchLength
        }
      }

      matchLengthAt = newMatchLengthAt
    }

    return bestMatchSize !== 0
      ? new Match(bestMatchInOld, bestMatchInNew, bestMatchSize + blockSize - 1)
      : null
  }

  // This method removes words that occur too many times. This way it reduces total count of comparison operations
  // and as result the diff algorithm takes less time. But the side effect is that it may detect false differences of
  // the repeating words.
  public removeRepeatingWords(): void {
    const threshold = this.newWords.length + this.options.repeatingWordsAccuracy
    const repeatingWords = Array.from(this.wordIndices.entries())
      .filter((i) => i[1].length > threshold)
      .map((i) => i[0])
    for (const w of repeatingWords) {
      this.wordIndices.delete(w)
    }
  }
}
