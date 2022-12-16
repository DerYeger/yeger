import { describe, expect, it } from 'vitest'

import { FOL } from '~/fol'
import type { Model } from '~/fol'

const model: Model = {
  nodes: new Set([1, 2]),
  functions: {
    binary: {
      h: {
        1: {
          1: 1,
          2: 1,
        },
        2: {
          1: 2,
          2: 2,
        },
      },
    },
    constants: {
      a: 1,
      b: 2,
      d: 1,
      second: 2,
    },
    unary: {
      f: {
        1: 2,
        2: 2,
      },
      myFunction: {
        1: 1,
        2: 2,
      },
    },
  },
  relations: {
    binary: {
      A: {
        1: new Set([1]),
      },
      MyRelation: {
        1: new Set([2]),
      },
    },
    unary: {
      B: new Set([2]),
      C: new Set([1, 2]),
    },
  },
}

describe('FOL semantics', () => {
  it.each([
    ['ff', false],
    ['!ff', true],
    ['tt', true],
    ['!tt', false],
    ['ff || ff', false],
    ['ff || tt', true],
    ['tt || ff', true],
    ['tt || tt', true],
    ['ff && ff', false],
    ['ff && tt', false],
    ['tt && ff', false],
    ['tt && tt', true],
    ['ff -> ff', true],
    ['ff -> tt', true],
    ['tt -> ff', false],
    ['tt -> tt', true],
    ['ff <-> ff', true],
    ['ff <-> tt', false],
    ['tt <-> ff', false],
    ['tt <-> tt', true],
    ['ff && tt || ff', false],
    ['exists c . A(c,c)', true],
    ['forall c . C(c)', true],
    ['A(a,a) && B(b)', true],
    ['B(f(d))', true],
    ['MyRelation(myFunction(a), second)', true],
    ['forall x. forall y. h(x,y) = x', true],
    ['(ff || tt) && tt', true],
  ])('evaluates "%s" to %b', (formula, expected) => {
    expect(FOL.evaluate(model, formula).get()).toBe(expected)
  })

  describe('evaluates correctly', () => {
    it('negative existential quantors', () => {
      expect(FOL.evaluate(model, 'exists x. MyRelation(x,x)').get()).toBe(false)
    })

    it('negative universal quantors', () => {
      expect(FOL.evaluate(model, 'forall x. MyRelation(x,x)').get()).toBe(false)
    })
  })

  describe('it throws', () => {
    it('on missing constants', () => {
      const model: Model = {
        nodes: new Set([1]),
        functions: {
          binary: {},
          constants: {},
          unary: {
            f: {},
          },
        },
        relations: {
          binary: {},
          unary: {},
        },
      }
      expect(() =>
        FOL.evaluate(model, 'f(a) = a')
      ).toThrowErrorMatchingInlineSnapshot('"Missing constant a"')
    })

    describe('on unary functions', () => {
      const model: Model = {
        nodes: new Set([1, 2]),
        functions: {
          binary: {},
          constants: {
            a: 1,
            b: 2,
          },
          unary: {
            f: {},
          },
        },
        relations: {
          binary: {},
          unary: {},
        },
      }

      it('if function is missing', () => {
        expect(() =>
          FOL.evaluate(model, 'g(a) = a')
        ).toThrowErrorMatchingInlineSnapshot('"Missing unary function g"')
      })

      it('if function is not defined for first argument', () => {
        expect(() =>
          FOL.evaluate(model, 'f(a) = a')
        ).toThrowErrorMatchingInlineSnapshot('"Non-total unary function f(1)"')
      })
    })

    describe('on binary functions', () => {
      const model: Model = {
        nodes: new Set([1, 2]),
        functions: {
          binary: {
            f: {},
            h: {
              1: { 1: 1 },
            },
          },
          constants: {
            a: 1,
            b: 2,
          },
          unary: {},
        },
        relations: {
          binary: {},
          unary: {},
        },
      }

      it('if function is missing', () => {
        expect(() =>
          FOL.evaluate(model, 'g(a, b) = a')
        ).toThrowErrorMatchingInlineSnapshot('"Missing binary function g"')
      })

      it('if function is not defined for first argument', () => {
        expect(() =>
          FOL.evaluate(model, 'f(b, a) = a')
        ).toThrowErrorMatchingInlineSnapshot(
          '"Non-total binary function f(2, ...)"'
        )
      })

      it('if function is not defined for second argument', () => {
        expect(() =>
          FOL.evaluate(model, 'h(a, b) = a')
        ).toThrowErrorMatchingInlineSnapshot(
          '"Non-total binary function h(1, 2)"'
        )
      })
    })

    it('on missing unary relations', () => {
      const model: Model = {
        nodes: new Set([1]),
        functions: {
          binary: {},
          constants: {},
          unary: {},
        },
        relations: {
          binary: {},
          unary: {},
        },
      }
      expect(() =>
        FOL.evaluate(model, 'A(x)')
      ).toThrowErrorMatchingInlineSnapshot('"Missing unary relation A"')
    })

    it('on missing binary relations', () => {
      const model: Model = {
        nodes: new Set([1]),
        functions: {
          binary: {},
          constants: {},
          unary: {},
        },
        relations: {
          binary: {},
          unary: {},
        },
      }
      expect(() =>
        FOL.evaluate(model, 'B(x,y)')
      ).toThrowErrorMatchingInlineSnapshot('"Missing binary relation B"')
    })
  })
})
