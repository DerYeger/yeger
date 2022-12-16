import { Node } from 'ohm-js'
import { BoundVariable, Expression, Formula } from '~/model'

export type BoundVariables = Set<String>

declare module 'ohm-js' {
  interface Node {
    args: {
      boundVariables: BoundVariables
    }
    parseExpression(boundVariables: BoundVariables): Expression
    parseFormula(boundVariables: BoundVariables): Formula
    parseString(): string
    parseVariable(boundVariables: BoundVariables): BoundVariable
  }

  interface Dict {
    parseFormula(boundVariables: BoundVariables): Formula
  }
}
