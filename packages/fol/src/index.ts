import type { Result } from 'resumon'
import { Err, Ok } from 'resumon'

import grammar from '~/fol.ohm-bundle'
import type {
  Formula,
  Model,
  ModelCheckerMode,
  ModelCheckerTrace,
} from '~/model'
import { parse } from '~/parser'

export * from '~/fol.ohm-bundle'
export * from '~/model'
export * from '~/validator'
export type { MatchResult } from 'ohm-js'

function evaluate(model: Model, formula: string): Result<boolean, string> {
  return parse(formula).andThen<boolean>((parsedFormula) => {
    try {
      return new Ok(parsedFormula.evaluate(model, {}))
    } catch (err) {
      return new Err((err as Error).message)
    }
  })
}

function traceEvaluation(
  mode: ModelCheckerMode,
  expected: boolean,
  model: Model,
  formula: string,
): Result<ModelCheckerTrace, string> {
  return parse(formula).andThen<ModelCheckerTrace>((parsedFormula) => {
    try {
      return new Ok(parsedFormula.traceEvaluation(mode, expected, model, {}))
    } catch (err) {
      return new Err((err as Error).message)
    }
  })
}

function trace(
  mode: ModelCheckerMode,
  expected: boolean,
  model: Model,
  formula: Formula,
): Result<ModelCheckerTrace, string> {
  try {
    return new Ok(formula.traceEvaluation(mode, expected, model, {}))
  } catch (err) {
    return new Err((err as Error).message)
  }
}

export const FOL = {
  evaluate,
  match: (formula: string) => grammar.match(formula),
  parse,
  trace,
  traceEvaluation,
} as const
