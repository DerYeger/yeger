import { describe, expect, test } from 'vitest'

import { Validator } from '../src/index'
import { TestData } from './test-utils'

describe('FOL validation', () => {
  describe('of models', () => {
    test.each(TestData.validModels)('accepts valid models', (model) => {
      const result = Validator.validateModel(model)
      expect(result.isOk, result.getErrorOrUndefined()).toBe(true)
    })

    test.each(TestData.invalidModels)('does not accept model with %s', (_, model) => {
      const result = Validator.validateModel(model)
      expect(result.isError).toBe(true)
    })
  })
})
