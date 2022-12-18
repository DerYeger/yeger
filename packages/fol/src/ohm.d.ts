import { Node } from 'ohm-js'
import { BoundVariable, Term, Formula } from '~/model'

export type BoundVariables = Set<String>

declare module 'ohm-js' {
  interface Node {
    args: {
      boundVariables: BoundVariables
    }
    parseFormula(boundVariables: BoundVariables): Formula
    parseString(): string
    parseTerm(boundVariables: BoundVariables): Term
    parseTermList(boundVariables: BoundVariables): Term[]
    parseVariable(boundVariables: BoundVariables): BoundVariable
  }

  interface Dict {
    parseFormula(boundVariables: BoundVariables): Formula
  }
}
