import { deepFreeze } from '~/runtime/utils'
import type { KeyHierarchyOptions } from '~/types'

export function precomputeHierarchy(path: unknown[], currentConfig: any, options: Required<KeyHierarchyOptions>): any {
  const result: any = {}

  // Iterate over all own properties, including symbols
  const keys = [...Object.keys(currentConfig), ...Object.getOwnPropertySymbols(currentConfig)] as (string | symbol)[]

  for (const key of keys) {
    const value = currentConfig[key]
    const currentPath = [...path, key]

    if (typeof value === 'boolean') {
      // Leaf node: return the path
      result[key] = options.freeze ? deepFreeze(currentPath) : [...currentPath]
    } else if (typeof value === 'object' && value !== null) {
      // Nested object: recurse
      const nested = precomputeHierarchy(currentPath, value, options)
      nested.__key = options.freeze ? deepFreeze(currentPath) : [...currentPath]
      result[key] = nested
    } else if (typeof value === 'function') {
      // Function: precompute the sub-config by calling with dummy argument (assumes return is independent of arg)
      const subConfig = value(undefined)

      // Wrap the function to build on demand without re-evaluating the config function
      result[key] = (arg: unknown) => {
        const argPath = options.freeze ? structuredClone(arg) : arg
        const functionPath = [...path, [key, argPath]]

        if (typeof subConfig === 'boolean') {
          // Leaf node
          return options.freeze ? deepFreeze(functionPath) : functionPath
        } else if (typeof subConfig === 'object' && subConfig !== null) {
          // Nested object: build the sub-hierarchy with the dynamic path
          const nested = precomputeHierarchy(functionPath, subConfig, options)
          nested.__key = options.freeze ? deepFreeze(functionPath) : functionPath
          return nested
        } else {
          throw new Error(`Unexpected return type from config function at key "${typeof key === 'symbol' ? String(key) : key}"`)
        }
      }
    }
  }

  return result
}
