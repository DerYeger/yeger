import { describe, test } from 'vitest'

import { defineGraphConfig } from '../src/config/config'

describe('Config', () => {
  describe('can be defined', () => {
    test('using default values', ({ expect }) => {
      const config = defineGraphConfig()
      expect(config).toMatchSnapshot()
    })

    test('with deep merging', ({ expect }) => {
      const defaultConfig = defineGraphConfig()
      const customConfig = defineGraphConfig({
        simulation: {
          forces: {
            collision: {
              radiusMultiplier: 42,
            },
          },
        },
      })
      const customCollisionForce = customConfig.simulation.forces.collision
      expect(customCollisionForce).not.toBe(false)
      // @ts-expect-error It has been asserted that the force is not false
      expect(customCollisionForce.radiusMultiplier).toEqual(42)
      expect(customConfig).not.toEqual(defaultConfig)

      const customMerge = {
        ...defaultConfig,
        simulation: {
          ...defaultConfig.simulation,
          forces: {
            ...defaultConfig.simulation.forces,
            collision: {
              ...defaultConfig.simulation.forces.collision,
              radiusMultiplier: 42,
            },
          },
        },
      }
      expect(customMerge.simulation.forces).toStrictEqual(customConfig.simulation.forces)
    })
  })
})
