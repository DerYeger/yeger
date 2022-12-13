import type { Result } from 'resumon'
import { Err, Ok } from 'resumon'

import type { Model, UnsafeRecord } from '~/model'

export type ValidationResult = Result<null, string>

function isRecordTotal(
  record: UnsafeRecord<number, number>,
  nodes: number[]
): boolean {
  return nodes.every((node) => record[node] !== undefined)
}

function allValuesAreInRange(
  record: UnsafeRecord<string | number, number>,
  nodes: Set<number>
): ValidationResult {
  for (const value of Object.values(record)) {
    if (value === undefined || !nodes.has(value)) {
      return new Err(`value ${value} not in range`)
    }
  }
  return new Ok(null)
}

function allKeysAreInRange(
  record: UnsafeRecord<number, unknown>,
  nodes: Set<number>
): ValidationResult {
  for (const key of Object.keys(record).map((key) => parseInt(key))) {
    if (isNaN(key) || !nodes.has(key)) {
      return new Err(`key ${key} not in range`)
    }
  }
  return new Ok(null)
}

function validateConstants(model: Model): ValidationResult {
  return allValuesAreInRange(model.functions.constants, model.nodes)
}

function validateUnaryFunctionTotality(
  model: Model,
  nodes: number[]
): ValidationResult {
  for (const [name, unaryFunction] of Object.entries(model.functions.unary)) {
    if (!isRecordTotal(unaryFunction ?? {}, nodes)) {
      return new Err(`unary function ${name} is not total`)
    }
  }
  return new Ok(null)
}

function validateUnaryFunctions(model: Model): ValidationResult {
  for (const [name, unaryFunction] of Object.entries(model.functions.unary)) {
    if (unaryFunction === undefined) {
      return new Err(`unary function ${name} not defined`)
    }
    const result = allKeysAreInRange(unaryFunction, model.nodes)
      .andThen(() => allValuesAreInRange(unaryFunction, model.nodes))
      .mapError((error) => `${error} for binary function ${name}`)
    if (result.isError) {
      return result
    }
  }
  return new Ok(null)
}

function validateBinaryFunctionTotality(
  model: Model,
  nodes: number[]
): ValidationResult {
  for (const [name, binaryFunction] of Object.entries(model.functions.binary)) {
    if (binaryFunction === undefined) {
      return new Err(`binary function ${name} not defined`)
    }
    const curriedFunctions = nodes.map((node) => binaryFunction![node])
    for (const curriedFunction of curriedFunctions) {
      if (curriedFunction === undefined) {
        return new Err(`binary function ${name} is not total`)
      }
      if (!isRecordTotal(curriedFunction, nodes)) {
        return new Err(`binary function ${name} is not total`)
      }
    }
  }
  return new Ok(null)
}

function validateBinaryFunctions(model: Model): ValidationResult {
  for (const [name, binaryFunction] of Object.entries(model.functions.binary)) {
    if (binaryFunction === undefined) {
      return new Err(`binary function ${name} not defined`)
    }
    const result = allKeysAreInRange(binaryFunction, model.nodes)
    if (result.isError) {
      return result.mapError((error) => `${error} for binary function ${name}`)
    }
    for (const curriedFunction of Object.values(binaryFunction)) {
      if (curriedFunction === undefined) {
        return new Err(`binary function ${name} is partial`)
      }
      const curriedResult = allKeysAreInRange(
        curriedFunction,
        model.nodes
      ).andThen(() => allValuesAreInRange(curriedFunction, model.nodes))
      if (curriedResult.isError) {
        return curriedResult.mapError(
          (error) => `${error} for binary function ${name}`
        )
      }
    }
  }
  return new Ok(null)
}

function validateModel(model: Model): ValidationResult {
  const nodes = [...model.nodes]
  return validateConstants(model)
    .andThen(() => validateUnaryFunctionTotality(model, nodes))
    .andThen(() => validateUnaryFunctions(model))
    .andThen(() => validateBinaryFunctionTotality(model, nodes))
    .andThen(() => validateBinaryFunctions(model))
}

export const Validator = {
  validateModel,
} as const
