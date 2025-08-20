import { createClone, deepFreeze } from '~/runtime/utils'
import { DYNAMIC_EXTENDED_SEGMENT, DYNAMIC_SEGMENT } from '~/types'
import type { KeyHierarchyOptions } from '~/types'

export function precomputeHierarchy(path: unknown[], currentConfig: any, options: Required<KeyHierarchyOptions>): any {
  const result: any = {}

  // Iterate over all own properties, including symbols
  const keys = [...Object.keys(currentConfig), ...Object.getOwnPropertySymbols(currentConfig)]
    .filter((key) => key !== DYNAMIC_SEGMENT && key !== DYNAMIC_EXTENDED_SEGMENT) as (string | symbol)[]

  for (const key of keys) {
    const value = currentConfig[key]
    const currentPath = [...path, key]

    if (typeof value === 'boolean') {
      // Leaf node: return the path
      result[key] = options.freeze ? deepFreeze(currentPath) : [...currentPath]
    } else if (typeof value === 'object' && value !== null) {
      // Check if this is a DynamicExtend object
      if (DYNAMIC_EXTENDED_SEGMENT in value) {
        // Extract the extended config (symbols are not enumerable, so spread gets everything else)
        const extendedConfig = { ...value }

        // Create a function that returns the precomputed hierarchy for the extended config
        result[key] = (arg: unknown) => {
          const argPath = options.freeze ? createClone(arg) : arg
          const functionPath = [...path, [key, argPath]]

          // Precompute the sub-hierarchy with the extended config
          const nested = precomputeHierarchy(functionPath, extendedConfig, options)
          nested.__key = options.freeze ? deepFreeze(functionPath) : functionPath
          return nested
        }
      } else if (DYNAMIC_SEGMENT in value) { // Check if this is a DynamicLeaf object
        // Create a function that returns the final path
        result[key] = (arg: unknown) => {
          const argPath = options.freeze ? createClone(arg) : arg
          const functionPath = [...path, [key, argPath]]

          // Leaf node
          return options.freeze ? deepFreeze(functionPath) : functionPath
        }
      } else { // Regular nested object: recurse
        const nested = precomputeHierarchy(currentPath, value, options)
        nested.__key = options.freeze ? deepFreeze(currentPath) : [...currentPath]
        result[key] = nested
      }
    }
  }

  return result
}
