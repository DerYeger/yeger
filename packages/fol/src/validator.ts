import type { Result } from 'resumon'
import { Err, Ok } from 'resumon'

import type { Model } from '~/model'

export type ValidationResult = Result<null, string>

function allValuesAreInRange(
  record: Record<string, number>,
  domain: Set<number>
): ValidationResult {
  for (const value of Object.values(record)) {
    if (!domain.has(value)) {
      // TODO: Remove "Value "
      return new Err(`Value ${value} is not part of the domain`)
    }
  }
  return new Ok(null)
}

function allKeysAreInRange(
  record: Record<string, unknown>,
  domain: Set<number>
): ValidationResult {
  const keys = Object.keys(record)
    .flatMap((key) => key.split(','))
    .map((key) => parseInt(key))
  for (const key of keys) {
    if (isNaN(key) || !domain.has(key)) {
      return new Err(`${key} is not part of the domain`)
    }
  }
  return new Ok(null)
}

function validateConstants(model: Model): ValidationResult {
  return allValuesAreInRange(model.constants, model.domain)
}

function validateFunctionTotality(
  model: Model,
  domain: number[]
): ValidationResult {
  for (const func of Object.values(model.functions)) {
    if (!func.isTotal(domain)) {
      return new Err(`Function ${func.name} is not total.`)
    }
  }
  return new Ok(null)
}

function validateFunctionDomainsAndRanges(model: Model): ValidationResult {
  for (const func of Object.values(model.functions)) {
    const result = allKeysAreInRange(func.data, model.domain)
      .andThen(() => allValuesAreInRange(func.data, model.domain))
      .mapError((error) => `${error} for function ${func.name}.`)
    if (result.isError) {
      return result
    }
  }
  return new Ok(null)
}

function validateModel(model: Model): ValidationResult {
  const domain = [...model.domain]
  // TODO: Validate relations
  // TODO: Merge both functions validations into single loop
  return validateConstants(model)
    .andThen(() => validateFunctionTotality(model, domain))
    .andThen(() => validateFunctionDomainsAndRanges(model))
}

export const Validator = {
  validateModel,
} as const
