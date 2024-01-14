import { describe, expect, it } from 'vitest'

import { Vector } from '~/index'

describe('Vector', () => {
  describe('can be initialized', () => {
    it('using the constructor', () => {
      const vector = new Vector(42, 7)
      expect(vector.x).toEqual(42)
      expect(vector.y).toEqual(7)
    })

    it('using the static function', () => {
      const vector = Vector.of([42, 7])
      expect(vector.x).toEqual(42)
      expect(vector.y).toEqual(7)
    })
  })

  describe('has operations that', () => {
    describe('with a scalar', () => {
      it('multiply', () => {
        const vector = new Vector(42, 7).multiply(2)
        expect(vector.x).toEqual(84)
        expect(vector.y).toEqual(14)
      })

      it('divide', () => {
        const vector = new Vector(42, 7).divide(7)
        expect(vector.x).toEqual(6)
        expect(vector.y).toEqual(1)
      })
    })

    describe('with another vector', () => {
      it('add', () => {
        const vector = new Vector(42, 7).add(new Vector(-7, 7))
        expect(vector.x).toEqual(35)
        expect(vector.y).toEqual(14)
      })

      it('subtract', () => {
        const vector = new Vector(42, 7).subtract(new Vector(-7, 7))
        expect(vector.x).toEqual(49)
        expect(vector.y).toEqual(0)
      })

      it('calculate the dot product', () => {
        const dotProduct = new Vector(1.5, 0.5).dot(new Vector(2, 8))
        expect(dotProduct).toEqual(7)
      })

      it('calculate the cross product', () => {
        const crossProduct = new Vector(2, 3).cross(new Vector(-1, 2))
        expect(crossProduct).toEqual(7)
      })

      it('calculate the Hadamard product', () => {
        const hadamardProduct = new Vector(42, 7).hadamard(new Vector(-1, 2))
        expect(hadamardProduct.x).toEqual(-42)
        expect(hadamardProduct.y).toEqual(14)
      })
    })

    it('calculate length', () => {
      const length = new Vector(3, 4).length()
      expect(length).toEqual(5)
    })

    it('normalize vectors', () => {
      const normalized = new Vector(-5, 0).normalize()
      expect(normalized.x).toEqual(-1)
      expect(normalized.y).toEqual(0)
      expect(normalized.length()).toEqual(1)
    })

    describe('rotate vectors', () => {
      it('by radians', () => {
        const vector = new Vector(1, 0).rotateByRadians(Math.PI * 0.5)
        expect(vector.x).toBeCloseTo(0)
        expect(vector.y).toBeCloseTo(1)
      })

      it('by degrees', () => {
        const vector = new Vector(1, 0).rotateByDegrees(90)
        expect(vector.x).toBeCloseTo(0)
        expect(vector.y).toBeCloseTo(1)
      })
    })

    it('can be chained', () => {
      const vector = new Vector(-5, 0)
        .normalize()
        .rotateByDegrees(180)
        .add(Vector.of([0, 1]))
        .multiply(42)
      expect(vector.x).toBeCloseTo(42)
      expect(vector.y).toBeCloseTo(42)
    })

    it('do not mutate', () => {
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
