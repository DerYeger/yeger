import { deepFreeze } from '~/runtime/utils'
import type { KeyHierarchyOptions } from '~/types'

export function createProxy<T>(path: unknown[], currentConfig: unknown, options: Required<KeyHierarchyOptions>): unknown {
  return new Proxy(
    { 'Partially resolved key: No leaf node was reached during traversal.': true },
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

        // Handle function properties
        if (typeof value === 'function') {
          return (arg: unknown) => {
            const result = value(arg)
            const argPath = options.freeze ? structuredClone(arg) : arg
            const functionPath = [
              ...path,
              [prop, argPath],
            ]
            if (typeof result === 'object' && result !== null) {
              // Continue with nested object
              return createProxy(functionPath, result, options)
            }
            // Leaf node reached
            if (options.freeze) {
              return deepFreeze(functionPath)
            }
            return functionPath
          }
        }

        // Handle object properties (non-functions)
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
