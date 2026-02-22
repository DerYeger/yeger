import { describe, expect, test } from 'vitest'

import { FOL } from '../src/index'
import { TestData } from './test-utils'

describe('FOL parser', () => {
  test.each(TestData.validFormulas)('can parse "%s"', (formula) => {
    const result = FOL.parse(formula).get()
    expect(result).toMatchSnapshot()
    const outputString = result.toFormattedString()
    expect(FOL.parse(outputString).get().toFormattedString()).toEqual(outputString)
  })

  test('can parse operators', ({ expect }) => {
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
    test('existential quantors', ({ expect }) => {
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

    test('universal quantors', ({ expect }) => {
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

    test('relations', ({ expect }) => {
      const result = FOL.parse('A(a,a, a) && B(b)').get()
      expect(result.toFormattedString()).toMatchInlineSnapshot('"A(a,a,a) ∧ B(b)"')
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

    test('functions', ({ expect }) => {
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

    test('long identifiers', ({ expect }) => {
      const result = FOL.parse('MyRelation(myFunction(a), second)').get()
      expect(result.toFormattedString()).toMatchInlineSnapshot('"MyRelation(myFunction(a),second)"')
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

  test('can parse parentheses', ({ expect }) => {
    const result = FOL.parse('(ff || tt) && tt').get()
    expect(result.toFormattedString()).toMatchInlineSnapshot('"(⊥ ∨ ⊤) ∧ ⊤"')
  })
})
