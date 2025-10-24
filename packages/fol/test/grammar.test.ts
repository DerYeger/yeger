import { describe, expect, it } from 'vitest'

import { FOL } from '../src/index'
import { TestData } from './test-utils'

describe('FOL grammar', () => {
  it.each(TestData.validFormulas)('parses valid formula "%s"', (formula) => {
    const result = FOL.match(formula)
    expect(result.succeeded(), result.message).toBe(true)
    // console.log(FOL.parse(formula))
  })

  it.each(TestData.invalidFormulas)(
    'does not parse invalid formula "%s"',
    (formula) => {
      const result = FOL.match(formula)
      expect(result.failed(), result.message).toBe(true)
      // console.log(result.message)
    },
  )
})
