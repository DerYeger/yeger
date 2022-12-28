import type { Result } from 'resumon'
import { Err, Ok } from 'resumon'

import type { Model } from '~/model'

export type ValidationResult = Result<null, string>

function allElementsAreInRange(
  elements: number[],
  domain: Set<number>
): ValidationResult {
  for (const element of elements) {
    if (isNaN(element) || !domain.has(element)) {
      return new Err(`${element} is not part of the domain.`)
    }
  }
  return new Ok(null)
}

function allValuesAreInRange(
  record: Record<string, number>,
  domain: Set<number>
): ValidationResult {
  return allElementsAreInRange(Object.values(record), domain)
}

function allKeysAreInRange(
  record: Record<string, unknown>,
  domain: Set<number>
): ValidationResult {
  const keys = Object.keys(record)
    .flatMap((key) => key.split(','))
    .map((key) => parseInt(key))
  return allElementsAreInRange(keys, domain)
}

function validateConstants(model: Model): ValidationResult {
  return allValuesAreInRange(model.constants, model.domain)
}

function validateFunctions(model: Model): ValidationResult {
  const domain = [...model.domain]
  for (const func of Object.values(model.functions)) {
    if (!func.isTotal(domain)) {
      return new Err(`Function ${func.name} is not total.`)
    }
    const result = allKeysAreInRange(func.data, model.domain)
      .andThen(() => allValuesAreInRange(func.data, model.domain))
      .mapError((error) => `${error} for function ${func.name}.`)
    if (result.isError) {
      return result
    }
  }
  return new Ok(null)
}

function validateRelations(model: Model): ValidationResult {
  for (const relation of Object.values(model.relations)) {
    const elements = [...relation.data]
      .flatMap((entry) => entry.split(','))
      .map((element) => parseInt(element))
    const result = allElementsAreInRange(elements, model.domain)
    if (result.isError) {
      return result
    }
  }
  return new Ok(null)
}

function validateModel(model: Model): ValidationResult {
  return validateConstants(model)
    .andThen(() => validateFunctions(model))
    .andThen(() => validateRelations(model))
}

export const Validator = {
  validateModel,
} as const
