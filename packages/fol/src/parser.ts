import type { NonterminalNode } from 'ohm-js'
import type { Result } from 'resumon'
import { Err, Ok } from 'resumon'

import type { FOLSemantics } from '~/fol.ohm-bundle'
import grammar from '~/fol.ohm-bundle'
import { BoundVariable, ConstantTerm, FunctionTerm } from '~/model'
import type { Formula, Term } from '~/model'
import {
  AndFormula,
  BiImplicationFormula,
  BooleanLiteral,
  EqualityRelationFormula,
  ExistentialQuantorFormula,
  ImplicationFormula,
  NotFormula,
  OrFormula,
  ParenthesizedFormula,
  RelationFormula,
  UniversalQuantorFormula,
} from '~/model/formula'

const semantics: FOLSemantics = grammar
  .createSemantics()
  .addOperation<string>('parseString()', {
    ident(_) {
      return this.sourceString
    },
  })
  .addOperation<BoundVariable>('parseVariable(boundVariables)', {
    BoundVariable(name) {
      return new BoundVariable(name.parseString())
    },
  })
  .addOperation<Term>('parseTerm(boundVariables)', {
    ConstantOrBoundVariable(name) {
      const parsedName = name.parseString()
      if (this.args.boundVariables.has(parsedName)) {
        return new BoundVariable(parsedName)
      }
      return new ConstantTerm(parsedName)
    },
    Function(name, _leftParen, terms, _rightParen) {
      return new FunctionTerm(
        name.parseString(),
        terms.parseTermList(this.args.boundVariables)
      )
    },
  })
  .addOperation<Term[]>('parseTermList(boundVariables)', {
    TermList(terms) {
      return terms
        .asIteration()
        .children.map((term: NonterminalNode) =>
          term.parseTerm(this.args.boundVariables)
        )
    },
  })
  .addOperation<Formula>('parseFormula(boundVariables)', {
    OrFormula_or(left, _operator, right) {
      return new OrFormula(
        left.parseFormula(this.args.boundVariables),
        right.parseFormula(this.args.boundVariables)
      )
    },
    AndFormula_and(left, _operator, right) {
      return new AndFormula(
        left.parseFormula(this.args.boundVariables),
        right.parseFormula(this.args.boundVariables)
      )
    },
    ImplicationFormula_implication(left, _operator, right) {
      return new ImplicationFormula(
        left.parseFormula(this.args.boundVariables),
        right.parseFormula(this.args.boundVariables)
      )
    },
    BiImplicationFormula_biImplication(left, _operator, right) {
      return new BiImplicationFormula(
        left.parseFormula(this.args.boundVariables),
        right.parseFormula(this.args.boundVariables)
      )
    },
    UnaryFormula_paren(_leftParen, inner, _rightParen) {
      return new ParenthesizedFormula(
        inner.parseFormula(this.args.boundVariables)
      )
    },
    UnaryFormula_not(_not, inner) {
      return new NotFormula(inner.parseFormula(this.args.boundVariables))
    },
    UnaryFormula_universal(_quantor, variable, _dot, inner) {
      const parsedVariable = variable.parseVariable(this.args.boundVariables)
      const newBoundVariables = new Set([
        ...this.args.boundVariables,
        parsedVariable.name,
      ])
      return new UniversalQuantorFormula(
        parsedVariable,
        inner.parseFormula(newBoundVariables)
      )
    },
    UnaryFormula_existential(_quantor, variable, _dot, inner) {
      const parsedVariable = variable.parseVariable(this.args.boundVariables)
      const newBoundVariables = new Set([
        ...this.args.boundVariables,
        parsedVariable.name,
      ])
      return new ExistentialQuantorFormula(
        parsedVariable,
        inner.parseFormula(newBoundVariables)
      )
    },
    Relation_regular(name, _leftParen, terms, _rightParen) {
      return new RelationFormula(
        name.parseString(),
        terms.parseTermList(this.args.boundVariables)
      )
    },
    Relation_equality(firstTerm, _equality, secondTerm) {
      return new EqualityRelationFormula(
        firstTerm.parseTerm(this.args.boundVariables),
        secondTerm.parseTerm(this.args.boundVariables)
      )
    },
    True(_) {
      return BooleanLiteral.True
    },
    False(_) {
      return BooleanLiteral.False
    },
  })

export function parse(formula: string): Result<Formula, string> {
  const matchResult = grammar.match(formula, 'Formula')
  if (matchResult.succeeded()) {
    return new Ok(semantics(matchResult).parseFormula(new Set()))
  }
  return new Err(matchResult.message ?? 'An unknown error occurred')
}
