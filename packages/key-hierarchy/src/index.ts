/**
 * Represents a key hierarchy for a given object type.
 * Dynamically derived based on a provided {@link KeyHierarchyConfig}.
 */
export type KeyHierarchy<T, Path extends readonly unknown[] = []> = {
  readonly [K in keyof T as K extends number ? `${K}` : K]: T[K] extends (...args: infer Args) => infer R
  ? (...args: Args) => R extends object
    ? KeyHierarchy<R, [...Path, readonly [K extends number ? `${K}` : K, ...Args]]> & { readonly __key: DeepReadonly<readonly [...Path, readonly [K extends number ? `${K}` : K, ...Args]]> }
    : DeepReadonly<readonly [...Path, readonly [K extends number ? `${K}` : K, ...Args]]>
  : T[K] extends object
  ? KeyHierarchy<T[K], readonly [...Path, K extends number ? `${K}` : K]> & { readonly __key: DeepReadonly<readonly [...Path, K extends number ? `${K}` : K]> }
  : DeepReadonly<readonly [...Path, K extends number ? `${K}` : K]>
}

/**
 * Declarative configuration of a key hierarchy.
 * @remarks **Note:** May not contain `__key` as a property at any place.
 */
export type KeyHierarchyConfig<T> = '__key' extends keyof T
  ? never // Trigger error at declaration if __key is present
  : {
    [K in keyof T]: T[K] extends (...args: infer Args) => infer R
    ? (...args: Args) => R extends object
      ? KeyHierarchyConfig<R>
      : R extends boolean
      ? boolean
      : never
    : T[K] extends object
    ? KeyHierarchyConfig<T[K]>
    : T[K] extends boolean
    ? boolean
    : never
  }

/**
 * Options for a key hierarchy.
 */
export interface KeyHierarchyOptions {
  /**
   * If enabled, all key arrays and their elements with be deeply frozen.
   * While already present at the type level, due to {@link DeepReadonly}, this ensures true immutability during runtime.
   * @remarks **Note:** Function arguments will be cloned with {@link structuredClone} to not affect the original values.
   * @remarks **Warning:** Does not work with values that are not supported by {@link structuredClone}.
   * @remarks **Warning:** Do not enable this for `queryKey` or `mutationKey` with `@tanstack/vue-query` as it will cause issues with reactivity.
   * @defaultValue false
   */
  freeze?: boolean
  /**
   * The method to use for key hierarchy computation.
   * `proxy` uses a {@link Proxy} to dynamically resolve keys on demand.
   * `precompute` computes the key hierarchy upfront. For this to work, all functions for dynamic key segments must be callable with `undefined` dummy arguments and do not have side effects.
   * @defaultValue 'proxy'
   */
  method?: 'proxy' | 'precompute'
}

/**
 * Defines a key hierarchy based on the provided configuration and options.
 * @remarks **Note:** This function uses {@link Proxy} objects by default. See {@link KeyHierarchyOptions.method} for other options.
 * @param config - The declarative {@link KeyHierarchyConfig} of the key hierarchy.
 * @param options - The {@link KeyHierarchyOptions} for the key hierarchy.
 * @returns The {@link KeyHierarchy} derived from the the given config and options.
 * @example
 * ```ts
 * const keys = defineKeyHierarchy({
 *   users: {
 *     getAll: true,
 *     create: true
 *     byId: (_id: number) => ({
 *       get: true,
 *       update: true,
 *       delete: true,
 *     }),
 *   },
 *   posts: {
 *     byUserId: (_userId: number) => true
 *   }
 * })
 * console.log(keys.users.getAll) // readonly ['users', 'getAll']
 * console.log(keys.users.byId(42).update) // readonly ['users', ['byId', number], 'update']
 * console.log(keys.users.byId(42).__key) // readonly ['users', ['byId', number]]
 * console.log(keys.posts.byUserId(42)) // readonly ['posts', ['byUserId', number]]
 * ```
 */
export function defineKeyHierarchy<T extends KeyHierarchyConfig<T>>(config: T, options: KeyHierarchyOptions = {}): KeyHierarchy<T> {
  const resolvedOptions: Required<KeyHierarchyOptions> = {
    freeze: false,
    method: 'proxy',
    ...options,
  }

  if (resolvedOptions.method === 'precompute') {
    return precomputeHierarchy([], config, resolvedOptions) as KeyHierarchy<T>
  }

  return createProxy([], config, resolvedOptions) as KeyHierarchy<T>
}

/**
 * Defines a key hierarchy module.
 * @remarks This function is a no-op and is used for type inference only.
 * @param config - The declarative {@link KeyHierarchyConfig} of the key hierarchy module.
 * @returns The {@link KeyHierarchyConfig} of the key hierarchy module.
 * @example
 * ```ts
 * const userKeyModule = defineKeyHierarchyModule({
 *   getAll: true,
 *   create: true
 *   byId: (_id: number) => ({
 *     get: true,
 *     update: true,
 *     delete: true,
 *   })
 * })
 *
 * const postKeyModule = defineKeyHierarchyModule({
 *   byIdUserId: (_userId: number) => true
 * })
 *
 * const keys = defineKeyHierarchy({
 *   users: userKeyModule,
 *   posts: postKeyModule
 * })
 * ```
 */
export function defineKeyHierarchyModule<T extends KeyHierarchyConfig<T>>(config: T): T {
  return config
}

function createProxy<T>(path: unknown[], currentConfig: unknown, options: Required<KeyHierarchyOptions>): unknown {
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
          return (...args: unknown[]) => {
            const result = value(...args)
            const argsPath = options.freeze ? args.map((arg) => structuredClone(arg)) : args
            const functionPath = [
              ...path,
              [prop, ...argsPath],
            ]
            if (typeof result === 'object') {
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
        if (typeof value === 'object') {
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

function precomputeHierarchy(path: unknown[], currentConfig: any, options: Required<KeyHierarchyOptions>): any {
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
      // Function: precompute the sub-config by calling with dummy arguments (assumes return is independent of args)
      const dummies = Array.from({ length: value.length }).fill(undefined)
      const subConfig = value(...dummies)

      // Wrap the function to build on demand without re-evaluating the config function
      result[key] = (...args: unknown[]) => {
        const argsPath = options.freeze ? args.map((arg) => structuredClone(arg)) : args
        const functionPath = [...path, [key, ...argsPath]]

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

function deepFreeze(value: any): unknown {
  Object.freeze(value)
  if (value === undefined) {
    return value
  }

  Object.getOwnPropertyNames(value).forEach((prop) => {
    if (value[prop] !== null
      && (typeof value[prop] === 'object' || typeof value[prop] === 'function')
      && !Object.isFrozen(value[prop])) {
      deepFreeze(value[prop])
    }
  })
  return value
}

/**
 * Represents a deeply readonly version of a type.
 */
export type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  // eslint-disable-next-line ts/no-unsafe-function-type
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T

/**
 * Represents a deeply readonly version of an array.
 */
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> { }

/**
 * Represents a deeply readonly version of an object.
 */
export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}
