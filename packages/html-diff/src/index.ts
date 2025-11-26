import { HtmlDiff } from './html-diff'
import type { BlockExpression } from './types'

export interface Options {
  /**
   * List of Regular Expressions which will be treated as one block (token) instead of being divided
   */
  readonly blocksExpression?: BlockExpression[]
}

export function diff(oldText: string, newText: string, { blocksExpression }: Options = {}): string {
  const finder = new HtmlDiff(oldText, newText)
  if (blocksExpression) {
    blocksExpression.forEach((block) => finder.addBlockExpression(block))
  }
  return finder.diff()
}
