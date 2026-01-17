import { createClone, deepFreeze } from './utils'
import { DYNAMIC_EXTENDED_SEGMENT, DYNAMIC_SEGMENT } from '../types'
import type { KeyHierarchyOptions } from '../types'

export function createProxy<T>(
  path: unknown[],
  currentConfig: unknown,
  options: Required<KeyHierarchyOptions>,
): unknown {
  return new Proxy(
    {},
    {
      get(_, prop: string | number | symbol) {
        // Return the frozen path for __key
        if (prop === '__key') {
          if (options.freeze) {
            return deepFreeze([...path])
          }
          return [...path]
        }

        const value = (currentConfig as T)[prop as keyof T]

        // Handle DynamicExtend - create a function that returns a proxy to the extended config
        if (typeof value === 'object' && value !== null && DYNAMIC_EXTENDED_SEGMENT in value) {
          return (arg: unknown) => {
            const argPath = options.freeze ? createClone(arg) : arg
            const functionPath = [...path, [prop, argPath]]

            // Extract the extended config (symbols are not enumerable, so spread gets everything else)
            const extendedConfig = { ...value }

            // Continue with nested object using the extended config
            return createProxy(functionPath, extendedConfig, options)
          }
        }

        // Handle DynamicLeaf - create a function that returns the final path
        if (typeof value === 'object' && value !== null && DYNAMIC_SEGMENT in value) {
          return (arg: unknown) => {
            const argPath = options.freeze ? createClone(arg) : arg
            const functionPath = [...path, [prop, argPath]]

            // Leaf node reached
            if (options.freeze) {
              return deepFreeze(functionPath)
            }
            return functionPath
          }
        }

        // Handle object properties (non-dynamic)
        if (typeof value === 'object' && value !== null) {
          return createProxy([...path, prop], value, options)
        }

        if (options.freeze) {
          return deepFreeze([...path, prop])
        }
        // Leaf node - return the path array
        return [...path, prop]
      },
    },
  )
}
