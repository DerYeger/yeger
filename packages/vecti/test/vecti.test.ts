import { describe, test } from 'vitest'

import { Vector } from '../src/index'

describe('Vector', () => {
  describe('can be initialized', () => {
    test('using the constructor', ({ expect }) => {
      const vector = new Vector(42, 7)
      expect(vector.x).toEqual(42)
      expect(vector.y).toEqual(7)
    })

    test('using the static function', ({ expect }) => {
      const vector = Vector.of([42, 7])
      expect(vector.x).toEqual(42)
      expect(vector.y).toEqual(7)
    })
  })

  describe('has operations that', () => {
    describe('with a scalar', () => {
      test('multiply', ({ expect }) => {
        const vector = new Vector(42, 7).multiply(2)
        expect(vector.x).toEqual(84)
        expect(vector.y).toEqual(14)
      })

      test('divide', ({ expect }) => {
        const vector = new Vector(42, 7).divide(7)
        expect(vector.x).toEqual(6)
        expect(vector.y).toEqual(1)
      })
    })

    describe('with another vector', () => {
      test('add', ({ expect }) => {
        const vector = new Vector(42, 7).add(new Vector(-7, 7))
        expect(vector.x).toEqual(35)
        expect(vector.y).toEqual(14)
      })

      test('subtract', ({ expect }) => {
        const vector = new Vector(42, 7).subtract(new Vector(-7, 7))
        expect(vector.x).toEqual(49)
        expect(vector.y).toEqual(0)
      })

      test('calculate the dot product', ({ expect }) => {
        const dotProduct = new Vector(1.5, 0.5).dot(new Vector(2, 8))
        expect(dotProduct).toEqual(7)
      })

      test('calculate the cross product', ({ expect }) => {
        const crossProduct = new Vector(2, 3).cross(new Vector(-1, 2))
        expect(crossProduct).toEqual(7)
      })

      test('calculate the Hadamard product', ({ expect }) => {
        const hadamardProduct = new Vector(42, 7).hadamard(new Vector(-1, 2))
        expect(hadamardProduct.x).toEqual(-42)
        expect(hadamardProduct.y).toEqual(14)
      })
    })

    test('calculate length', ({ expect }) => {
      const length = new Vector(3, 4).length()
      expect(length).toEqual(5)
    })

    test('normalize vectors', ({ expect }) => {
      const normalized = new Vector(-5, 0).normalize()
      expect(normalized.x).toEqual(-1)
      expect(normalized.y).toEqual(0)
      expect(normalized.length()).toEqual(1)
    })

    describe('rotate vectors', () => {
      test('by radians', ({ expect }) => {
        const vector = new Vector(1, 0).rotateByRadians(Math.PI * 0.5)
        expect(vector.x).toBeCloseTo(0)
        expect(vector.y).toBeCloseTo(1)
      })

      test('by degrees', ({ expect }) => {
        const vector = new Vector(1, 0).rotateByDegrees(90)
        expect(vector.x).toBeCloseTo(0)
        expect(vector.y).toBeCloseTo(1)
      })
    })

    test('can be chained', ({ expect }) => {
      const vector = new Vector(-5, 0)
        .normalize()
        .rotateByDegrees(180)
        .add(Vector.of([0, 1]))
        .multiply(42)
      expect(vector.x).toBeCloseTo(42)
      expect(vector.y).toBeCloseTo(42)
    })

    test('do not mutate', ({ expect }) => {
      const vector = new Vector(1, 1)
      const other = Vector.of([42, 42])
      vector.add(other)
      vector.subtract(other)
      vector.multiply(42)
      vector.divide(42)
      vector.normalize()
      vector.dot(other)
      vector.cross(other)
      vector.hadamard(other)
      vector.rotateByRadians(Math.PI * 0.5)
      vector.rotateByDegrees(180)
      expect(vector).toEqual(new Vector(1, 1))
      expect(other).toEqual(new Vector(42, 42))
    })
  })
})
