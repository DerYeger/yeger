import type { Result } from 'resumon'

import grammar from '~/fol.ohm-bundle'
import type { Model, ModelCheckerMode, ModelCheckerTrace } from '~/model'
import { parse } from '~/parser'

export * from '~/model'
export * from '~/validator'
export * from '~/fol.ohm-bundle'
export type { MatchResult } from 'ohm-js'

function evaluate(model: Model, formula: string): Result<boolean, string> {
  return parse(formula).map((parsedFormula) =>
    parsedFormula.evaluate(model, {})
  )
}

function traceEvaluation(
  mode: ModelCheckerMode,
  expected: boolean,
  model: Model,
  formula: string
): Result<ModelCheckerTrace, string> {
  return parse(formula).map((parsedFormula) =>
    parsedFormula.traceEvaluation(mode, expected, model, {})
  )
}

export const FOL = {
  evaluate,
  match: (formula: string) => grammar.match(formula),
  parse,
  traceEvaluation,
} as const
