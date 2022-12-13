import type { FOLSemantics } from '~/fol.ohm-bundle'
import grammar from '~/fol.ohm-bundle'
import type { Expression, Formula } from '~/model'
import {
  AndFormula,
  BiImplFormula,
  BinaryFunction,
  BinaryRelation,
  BooleanLiteral,
  BoundVariable,
  Constant,
  EqualityRelation,
  ExistentialQuantorFormula,
  ImplFormula,
  NotFormula,
  OrFormula,
  ParenthesizedFormula,
  UnaryFunction,
  UnaryRelation,
  UniversalQuantorFormula,
} from '~/model'

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
  .addOperation<Expression>('parseExpression(boundVariables)', {
    ConstantOrBoundVariable(name) {
      const parsedName = name.parseString()
      if (this.args.boundVariables.has(parsedName)) {
        return new BoundVariable(parsedName)
      }
      return new Constant(parsedName)
    },
    UnaryFunction(name, _leftParen, inner, _rightParen) {
      return new UnaryFunction(
        name.parseString(),
        inner.parseExpression(this.args.boundVariables)
      )
    },
    BinaryFunction(
      name,
      _leftParen,
      firstArgument,
      _comma,
      secondArgument,
      _rightParen
    ) {
      return new BinaryFunction(
        name.parseString(),
        firstArgument.parseExpression(this.args.boundVariables),
        secondArgument.parseExpression(this.args.boundVariables)
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
    ImplFormula_impl(left, _operator, right) {
      return new ImplFormula(
        left.parseFormula(this.args.boundVariables),
        right.parseFormula(this.args.boundVariables)
      )
    },
    BiImplFormula_biimpl(left, _operator, right) {
      return new BiImplFormula(
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
    UnaryRelation(name, _leftParen, expression, _rightParen) {
      return new UnaryRelation(
        name.parseString(),
        expression.parseExpression(this.args.boundVariables)
      )
    },
    BinaryRelation(
      name,
      _leftParen,
      firstExpression,
      _comma,
      secondExpression,
      _rightParen
    ) {
      return new BinaryRelation(
        name.parseString(),
        firstExpression.parseExpression(this.args.boundVariables),
        secondExpression.parseExpression(this.args.boundVariables)
      )
    },
    EqualityRelation(firstExpression, _equality, secondExpression) {
      return new EqualityRelation(
        firstExpression.parseExpression(this.args.boundVariables),
        secondExpression.parseExpression(this.args.boundVariables)
      )
    },
    True(_) {
      return BooleanLiteral.True
    },
    False(_) {
      return BooleanLiteral.False
    },
  })

export function parse(formula: string): Formula {
  const matchResult = grammar.match(formula, 'Formula')
  return semantics(matchResult).parseFormula(new Set())
}
