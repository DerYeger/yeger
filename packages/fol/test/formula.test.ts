import { describe, expect, it } from 'vitest'

import { FOL } from '../src/index'
import { TestData } from './test-utils'

describe('FOL formula', () => {
  it.each(TestData.validFormulas)(
    'has correct formattedString for "%s"',
    (formula) => {
      const result = FOL.parse(formula)
      expect(result.get().toFormattedString()).toMatchSnapshot()
      // console.log(result)
    },
  )
})
