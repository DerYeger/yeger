export type Mode = 'character' | 'tag' | 'whitespace' | 'number' | 'entity'

export type Action = 'equal' | 'delete' | 'insert' | 'none' | 'replace'

export interface Operation {
  readonly action: Action
  readonly startInOld: number
  readonly endInOld: number
  readonly startInNew: number
  readonly endInNew: number
}

export interface MatchOptions {
  readonly blockSize: number
  readonly repeatingWordsAccuracy: number
  readonly ignoreWhitespaceDifferences: boolean
}

export interface BlockExpression {
  /**
   * Regular Expression for a token
   */
  readonly exp: RegExp
  /**
   * Regular Expression for part of the token by which will be compared
   */
  readonly compareBy?: RegExp
}
