import { describe, expect, it } from 'vitest'

import { Validator } from '~/fol'
import { TestData } from '~test/test-utils'

describe('FOL validation', () => {
  describe('of models', () => {
    it.each(TestData.validModels)('accepts valid models', (model) => {
      const result = Validator.validateModel(model)
      expect(result.isOk, result.getErrorOrUndefined()).toBe(true)
    })

    it.each(TestData.invalidModels)(
      'does not accept model with %s',
      (_, model) => {
        const result = Validator.validateModel(model)
        expect(result.isError).toBe(true)
      },
    )
  })
})
