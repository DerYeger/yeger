import { FailedMatchResult } from 'ohm-js'
import { describe, expect, test } from 'vitest'

import { FOL } from '../src/index'
import { TestData } from './test-utils'

describe('FOL grammar', () => {
  test.each(TestData.validFormulas)('parses valid formula "%s"', (formula) => {
    const result = FOL.match(formula)
    expect(result.succeeded(), (result as FailedMatchResult).message).toBe(true)
  })

  test.each(TestData.invalidFormulas)('does not parse invalid formula "%s"', (formula) => {
    const result = FOL.match(formula)
    expect(result.failed(), (result as FailedMatchResult).message).toBe(true)
  })
})
