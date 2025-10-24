import { describe, expect, it } from 'vitest'

import { FOL } from '../src/index'
import { TestData } from './test-utils'

describe('FOL parser', () => {
  it.each(TestData.validFormulas)('can parse "%s"', (formula) => {
    const result = FOL.parse(formula).get()
    expect(result).toMatchSnapshot()
    const outputString = result.toFormattedString()
    expect(FOL.parse(outputString).get().toFormattedString()).toEqual(
      outputString,
    )
    // console.log(result)
  })

  it('can parse operators', () => {
    const result = FOL.parse('ff && tt || ff').get()
    expect(result.toFormattedString()).toMatchInlineSnapshot('"⊥ ∧ ⊤ ∨ ⊥"')
    expect(result).toMatchInlineSnapshot(`
      OrFormula {
        "left": AndFormula {
          "left": BooleanLiteral {
            "name": "⊥",
            "value": false,
          },
          "operator": "∧",
          "right": BooleanLiteral {
            "name": "⊤",
            "value": true,
          },
        },
        "operator": "∨",
        "right": BooleanLiteral {
          "name": "⊥",
          "value": false,
        },
      }
    `)
  })

  describe('can parse', () => {
    it('existential quantors', () => {
      const result = FOL.parse('exists c . A(c,c)').get()
      expect(result.toFormattedString()).toMatchInlineSnapshot('"∃c. A(c,c)"')
      expect(result).toMatchInlineSnapshot(`
        ExistentialQuantorFormula {
          "inner": RelationFormula {
            "name": "A",
            "terms": [
              BoundVariable {
                "name": "c",
              },
              BoundVariable {
                "name": "c",
              },
            ],
          },
          "quantor": "∃",
          "variable": BoundVariable {
            "name": "c",
          },
        }
      `)
    })

    it('universal quantors', () => {
      const result = FOL.parse('forall c . C(c)').get()
      expect(result.toFormattedString()).toMatchInlineSnapshot('"∀c. C(c)"')
      expect(result).toMatchInlineSnapshot(`
        UniversalQuantorFormula {
          "inner": RelationFormula {
            "name": "C",
            "terms": [
              BoundVariable {
                "name": "c",
              },
            ],
          },
          "quantor": "∀",
          "variable": BoundVariable {
            "name": "c",
          },
        }
      `)
    })

    it('relations', () => {
      const result = FOL.parse('A(a,a, a) && B(b)').get()
      expect(result.toFormattedString()).toMatchInlineSnapshot(
        '"A(a,a,a) ∧ B(b)"',
      )
      expect(result).toMatchInlineSnapshot(`
        AndFormula {
          "left": RelationFormula {
            "name": "A",
            "terms": [
              ConstantTerm {
                "name": "a",
              },
              ConstantTerm {
                "name": "a",
              },
              ConstantTerm {
                "name": "a",
              },
            ],
          },
          "operator": "∧",
          "right": RelationFormula {
            "name": "B",
            "terms": [
              ConstantTerm {
                "name": "b",
              },
            ],
          },
        }
      `)
    })

    it('functions', () => {
      const result = FOL.parse('B(f(d))').get()
      expect(result.toFormattedString()).toMatchInlineSnapshot('"B(f(d))"')
      expect(result).toMatchInlineSnapshot(`
        RelationFormula {
          "name": "B",
          "terms": [
            FunctionTerm {
              "argumentTerms": [
                ConstantTerm {
                  "name": "d",
                },
              ],
              "name": "f",
            },
          ],
        }
      `)
    })

    it('long identifiers', () => {
      const result = FOL.parse('MyRelation(myFunction(a), second)').get()
      expect(result.toFormattedString()).toMatchInlineSnapshot(
        '"MyRelation(myFunction(a),second)"',
      )
      expect(result).toMatchInlineSnapshot(`
        RelationFormula {
          "name": "MyRelation",
          "terms": [
            FunctionTerm {
              "argumentTerms": [
                ConstantTerm {
                  "name": "a",
                },
              ],
              "name": "myFunction",
            },
            ConstantTerm {
              "name": "second",
            },
          ],
        }
      `)
    })
  })

  it('can parse parentheses', () => {
    const result = FOL.parse('(ff || tt) && tt').get()
    expect(result.toFormattedString()).toMatchInlineSnapshot('"(⊥ ∨ ⊤) ∧ ⊤"')
  })
})
