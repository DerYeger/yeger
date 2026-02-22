import { describe, expect, test } from 'vitest'

import { FOL, Function, Model } from '../src/index'
import { TestData } from './test-utils'

describe('FOL semantics', () => {
  test.each([
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
    ['D(f(d))', true],
    ['MyRelation(myFunction(a), second)', true],
    ['forall x. forall y. h(x,y) = x', true],
    ['(ff || tt) && tt', true],
  ])('evaluates "%s" to %b', (formula, expected) => {
    expect(FOL.evaluate(TestData.testModel, formula).get()).toBe(expected)
    const trace = FOL.traceEvaluation('lazy', expected, TestData.testModel, formula).get()
    expect(trace.actual).toBe(expected)
    expect(trace.expected).toBe(expected)
  })

  describe('evaluates correctly', () => {
    test('negative existential quantors', ({ expect }) => {
      expect(FOL.evaluate(TestData.testModel, 'exists x. MyRelation(x,x)').get()).toBe(false)
    })

    test('negative universal quantors', ({ expect }) => {
      expect(FOL.evaluate(TestData.testModel, 'forall x. MyRelation(x,x)').get()).toBe(false)
    })
  })

  describe('it throws', () => {
    test('on missing constants', ({ expect }) => {
      const model = new Model(new Set([1]), { a: 1 }, [], [])
      expect(FOL.evaluate(model, 'a = b').getErrorOrUndefined()).toEqual(
        'Model is missing the constant b.',
      )
    })

    describe('on missing functions', () => {
      const model = new Model(new Set([1]), { a: 1 }, [new Function('f', 1, {})], [])

      test('if function is missing', ({ expect }) => {
        expect(FOL.evaluate(model, 'g(a) = a').getErrorOrUndefined()).toEqual(
          'Model is missing the function g.',
        )
      })

      test('if function is not defined for argument', ({ expect }) => {
        expect(FOL.evaluate(model, 'f(a) = a').getErrorOrUndefined()).toEqual(
          'Function f is not total. f(1) is not defined.',
        )
      })
    })

    test('on missing relations', ({ expect }) => {
      const model = new Model(new Set([1]), { x: 1 }, [], [])
      expect(FOL.evaluate(model, 'A(x)').getErrorOrUndefined()).toEqual(
        'Model is missing the relation A.',
      )
    })
  })
})
