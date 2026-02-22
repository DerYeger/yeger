import { describe, expect, test } from 'vitest'

import { FOL } from '../src/index'
import { TestData } from './test-utils'

describe('FOL formula', () => {
  test.each(TestData.validFormulas)('has correct formattedString for "%s"', (formula) => {
    const result = FOL.parse(formula)
    expect(result.get().toFormattedString()).toMatchSnapshot()
  })
})
