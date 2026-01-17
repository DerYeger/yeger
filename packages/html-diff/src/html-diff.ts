import { Match } from './match'
import { MatchFinder } from './match-finder'
import type { BlockExpression, Action, MatchOptions, Operation } from './types'
import { isTag } from './utils'
import { WordSplitter } from './word-splitter'

// This value defines balance between speed and memory utilization. The higher it is the faster it works and more memory consumes.
const MAXIMUM_GRANULARITY = 4

interface FindMatchProps {
  startInOld: number
  endInOld: number
  startInNew: number
  endInNew: number
}

export class HtmlDiff {
  public content: string[]
  private newText: string
  private oldText: string

  public newWords: string[]
  public oldWords: string[]
  private originalWordsInNew: Map<number, string>
  private originalWordsInOld: Map<number, string>

  public matchGranularity: number
  private blockExpressions: BlockExpression[]

  private repeatingWordsAccuracy: number
  private ignoreWhiteSpaceDifferences: boolean
  private orphanMatchThreshold: number

  public constructor(oldText: string, newText: string) {
    this.content = []
    this.newText = newText
    this.oldText = oldText

    this.newWords = []
    this.originalWordsInNew = new Map()
    this.oldWords = []
    this.originalWordsInOld = new Map()
    this.matchGranularity = 0
    this.blockExpressions = []

    this.repeatingWordsAccuracy = 1.0
    this.ignoreWhiteSpaceDifferences = false
    this.orphanMatchThreshold = 0.0

    this.addBlockExpression = this.addBlockExpression.bind(this)
  }

  public diff(): string {
    if (this.oldText === this.newText) {
      return this.newText
    }

    this.splitInputsIntoWords()

    this.matchGranularity = Math.min(
      MAXIMUM_GRANULARITY,
      this.oldWords.length,
      this.newWords.length,
    )
    const operations = this.operations()

    // set original words
    this.originalWordsInOld.forEach((value, key) => {
      this.oldWords[key] = value
    })

    this.originalWordsInNew.forEach((value, key) => {
      this.newWords[key] = value
    })

    for (const item of operations) {
      this.performOperation(item)
    }

    return this.content.join('')
  }

  public addBlockExpression(exp: BlockExpression): void {
    this.blockExpressions.push(exp)
  }

  public splitInputsIntoWords(): void {
    const words = WordSplitter.convertHtmlToListOfWords(this.oldText, this.blockExpressions)
    words.forEach((el, idx) => {
      if (el[1]) {
        this.originalWordsInOld.set(idx, el[1])
      }
    })
    this.oldWords = words.map((el) => el[0]!)

    // free memory, allow it for GC
    this.oldText = ''

    const newWords = WordSplitter.convertHtmlToListOfWords(this.newText, this.blockExpressions)

    newWords.forEach((el, idx) => {
      if (el[1]) {
        this.originalWordsInNew.set(idx, el[1])
      }
    })
    this.newWords = newWords.map((el) => el[0]!)

    // free memory, allow it for GC
    this.newText = ''
  }

  private performOperation(opp: Operation) {
    switch (opp.action) {
      case 'equal':
        this.processEqualOperation(opp)
        break
      case 'delete':
        this.processDeleteOperation(opp, 'diffdel')
        break
      case 'insert':
        this.processInsertOperation(opp, 'diffins')
        break
      case 'none':
        break
      case 'replace':
        this.processReplaceOperation(opp)
        break
    }
  }

  private processReplaceOperation(opp: Operation) {
    this.processDeleteOperation(opp, 'diffmod')
    this.processInsertOperation(opp, 'diffmod')
  }

  private processInsertOperation(opp: Operation, cssClass: string) {
    const text = this.newWords.filter((_s, pos) => pos >= opp.startInNew && pos < opp.endInNew)
    this.insertTag('ins', cssClass, text)
  }

  private processDeleteOperation(opp: Operation, cssClass: string) {
    const text = this.oldWords.filter((_s, pos) => pos >= opp.startInOld && pos < opp.endInOld)
    this.insertTag('del', cssClass, text)
  }

  private processEqualOperation(opp: Operation) {
    const result = this.newWords.filter((_s, pos) => pos >= opp.startInNew && pos < opp.endInNew)
    this.content.push(result.join(''))
  }

  public insertTag(tag: string, cssClass: string, content: string[]): void {
    const length = content.length
    let tags: string[]
    let nonTags: string[]
    let position = 0
    let rendering = ''
    while (true) {
      if (position >= length) {
        break
      }
      nonTags = this.consecutiveWhere(position, content, (x: string) => !isTag(x))
      position += nonTags.length
      if (nonTags.length !== 0) {
        rendering += `<${tag} class="${cssClass}">${nonTags.join('')}</${tag}>`
      }
      if (position >= length) {
        break
      }
      tags = this.consecutiveWhere(position, content, isTag)
      position += tags.length
      rendering += tags.join('')
    }

    this.content.push(rendering)
  }

  private consecutiveWhere(
    start: number,
    content: string[],
    predicate: (value: string) => boolean,
  ) {
    let answer, i, index, lastMatchingIndex, len, token
    content = content.slice(start, +content.length + 1 || 9e9)
    lastMatchingIndex = void 0
    for (index = i = 0, len = content.length; i < len; index = ++i) {
      token = content[index]!
      answer = predicate(token)
      if (answer === true) {
        lastMatchingIndex = index
      }
      if (answer === false) {
        break
      }
    }
    if (lastMatchingIndex != null) {
      return content.slice(0, +lastMatchingIndex + 1 || 9e9)
    }
    return []
  }

  public operations(): Operation[] {
    let positionInOld = 0
    let positionInNew = 0
    const operations: Operation[] = []

    const matches = this.matchingBlocks()
    matches.push(new Match(this.oldWords.length, this.newWords.length, 0))

    const matchesWithoutOrphans = this.removeOrphans(matches)

    for (const match of matchesWithoutOrphans) {
      const matchStartsAtCurrentPositionInOld = positionInOld === match.startInOld
      const matchStartsAtCurrentPositionInNew = positionInNew === match.startInNew

      let action: Action

      if (!matchStartsAtCurrentPositionInOld && !matchStartsAtCurrentPositionInNew) {
        action = 'replace'
      } else if (matchStartsAtCurrentPositionInOld && !matchStartsAtCurrentPositionInNew) {
        action = 'insert'
      } else if (!matchStartsAtCurrentPositionInOld) {
        action = 'delete'
      } else {
        action = 'none'
      }

      if (action !== 'none') {
        operations.push({
          action,
          startInOld: positionInOld,
          endInOld: match.startInOld,
          startInNew: positionInNew,
          endInNew: match.startInNew,
        })
      }

      if (match.size !== 0) {
        operations.push({
          action: 'equal',
          startInOld: match.startInOld,
          endInOld: match.endInOld,
          startInNew: match.startInNew,
          endInNew: match.endInNew,
        })
      }

      positionInOld = match.endInOld
      positionInNew = match.endInNew
    }

    return operations
  }

  private *removeOrphans(matches: Match[]) {
    let prev = null! as Match
    let curr = null! as Match

    for (const next of matches) {
      if (curr === null) {
        prev = new Match(0, 0, 0)
        curr = next
        continue
      }

      if (
        (prev?.endInOld === curr.startInOld && prev.endInNew === curr.startInNew) ||
        (curr.endInOld === next.startInOld && curr.endInNew === next.startInNew)
      ) {
        yield curr
        curr = next
        continue
      }

      const sumLength = (t: number, n: string) => t + n.length

      const oldDistanceInChars = this.oldWords
        .slice(prev?.endInOld, next.startInOld)
        .reduce(sumLength, 0)
      const newDistanceInChars = this.newWords
        .slice(prev?.endInNew, next.startInNew)
        .reduce(sumLength, 0)
      const currMatchLengthInChars = this.newWords
        .slice(curr.startInNew, curr.endInNew)
        .reduce(sumLength, 0)
      if (
        currMatchLengthInChars >
        Math.max(oldDistanceInChars, newDistanceInChars) * this.orphanMatchThreshold
      ) {
        yield curr
      }

      prev = curr
      curr = next
    }

    yield curr
  }

  public matchingBlocks(): Match[] {
    const matchingBlocks = [] as Match[]
    this.findMatchingBlocks({
      startInOld: 0,
      endInOld: this.oldWords.length,
      startInNew: 0,
      endInNew: this.newWords.length,
      matchingBlocks,
    })
    return matchingBlocks
  }

  private findMatchingBlocks({
    startInOld,
    endInOld,
    startInNew,
    endInNew,
    matchingBlocks,
  }: FindMatchProps & { matchingBlocks: Match[] }) {
    const match = this.findMatch({
      startInOld,
      endInOld,
      startInNew,
      endInNew,
    })

    if (match !== null) {
      if (startInOld < match.startInOld && startInNew < match.startInNew) {
        this.findMatchingBlocks({
          startInOld,
          endInOld: match.startInOld,
          startInNew,
          endInNew: match.startInNew,
          matchingBlocks,
        })
      }

      matchingBlocks.push(match)

      if (match.endInOld < endInOld && match.endInNew < endInNew) {
        this.findMatchingBlocks({
          startInOld: match.endInOld,
          endInOld,
          startInNew: match.endInNew,
          endInNew,
          matchingBlocks,
        })
      }
    }
  }

  public findMatch({ startInOld, endInOld, startInNew, endInNew }: FindMatchProps): Match | null {
    for (let i = this.matchGranularity; i > 0; i--) {
      const options: MatchOptions = {
        blockSize: i,
        repeatingWordsAccuracy: this.repeatingWordsAccuracy,
        ignoreWhitespaceDifferences: this.ignoreWhiteSpaceDifferences,
      }

      const finder = new MatchFinder({
        oldWords: this.oldWords,
        newWords: this.newWords,
        startInOld,
        endInOld,
        startInNew,
        endInNew,
        options,
      })
      const match = finder.findMatch()
      if (match !== null) {
        return match
      }
    }

    return null
  }
}
