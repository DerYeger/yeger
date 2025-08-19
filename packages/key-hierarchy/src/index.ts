import { precomputeHierarchy } from '~/runtime/precompute'
import { createProxy } from '~/runtime/proxy'
import { DYNAMIC_EXTEND, DYNAMIC_LEAF } from '~/types'
import type { KeyHierarchyConfig, KeyHierarchyOptions, KeyHierarchy, DynamicExtend, DynamicLeafWithExtend } from '~/types'

export type * from '~/types'

/**
 * Represents a configuration or a builder function for a key hierarchy.
 */
export type ConfigOrBuilder<T extends KeyHierarchyConfig<T>> = T | ((dynamic: typeof dynamicHelper) => T)

function resolveConfigOrBuilder<T extends KeyHierarchyConfig<T>>(configOrBuilder: ConfigOrBuilder<T>): T {
  return typeof configOrBuilder === 'function' ? configOrBuilder(dynamicHelper) : configOrBuilder
}

/**
 * Defines a key hierarchy based on the provided configuration and options.
 * @remarks **Note:** This function uses {@link Proxy} objects by default. See {@link KeyHierarchyOptions.method} for other options.
 * @param config - The declarative {@link KeyHierarchyConfig} of the key hierarchy.
 * @param options - The {@link KeyHierarchyOptions} for the key hierarchy.
 * @returns The {@link KeyHierarchy} derived from the given config and options.
 * @example
 * ```ts
 * const keys = defineKeyHierarchy((dynamic) => ({
 *   users: {
 *     getAll: true,
 *     create: true,
 *     byId: dynamic<number>().extend({
 *       get: true,
 *       update: true,
 *       delete: true,
 *     }),
 *   },
 *   posts: {
 *     byUserId: dynamic<number>(),
 *     byMonth: dynamic<number>().extend({
 *       byDay: dynamic<number>(),
 *     }),
 *     byAuthorAndYear: dynamic<{ authorId: string, year: number }>(),
 *     byTags: dynamic<{ tags: string[], filter?: PostFilter }>(),
 *   }
 * }))
 * console.log(keys.users.getAll) // readonly ['users', 'getAll']
 * console.log(keys.users.byId(42).update) // readonly ['users', ['byId', 42], 'update']
 * console.log(keys.users.byId(42).__key) // readonly ['users', ['byId', 42]]
 * console.log(keys.posts.byUserId(42)) // readonly ['posts', ['byUserId', 42]]
 * console.log(keys.posts.byMonth(3).byDay(15)) // readonly ['posts', ['byMonth', 3], ['byDay', 15]]
 * console.log(keys.posts.byAuthorAndYear({ authorId: 'id', year: 2023 })) // readonly ['posts', ['byAuthorAndYear', { authorId: 'id', year: 2023 }]]
 * ```
 */
export function defineKeyHierarchy<T extends KeyHierarchyConfig<T>>(configOrBuilder: ConfigOrBuilder<T>, options: KeyHierarchyOptions = {}): KeyHierarchy<T> {
  const resolvedOptions: Required<KeyHierarchyOptions> = {
    freeze: false,
    method: 'proxy',
    ...options,
  }

  const resolvedConfig = defineKeyHierarchyModule(configOrBuilder)

  if (resolvedOptions.method === 'precompute') {
    return precomputeHierarchy([], resolvedConfig, resolvedOptions) as KeyHierarchy<T>
  }

  return createProxy([], resolvedConfig, resolvedOptions) as KeyHierarchy<T>
}

/**
 * Defines a key hierarchy module.
 * @remarks This function is a no-op and is used for type inference only.
 * @param config - The declarative {@link KeyHierarchyConfig} of the key hierarchy module.
 * @returns The {@link KeyHierarchyConfig} of the key hierarchy module.
 * @example
 * ```ts
 * const userKeyModule = defineKeyHierarchyModule((dynamic) => ({
 *   getAll: true,
 *   create: true,
 *   byId: dynamic<number>().extend({
 *     get: true,
 *     update: true,
 *     delete: true,
 *   })
 * }))
 *
 * const postKeyModule = defineKeyHierarchyModule((dynamic) => ({
 *   byUserId: dynamic<number>(),
 *   byMonth: dynamic<number>().extend({
 *     byDay: dynamic<number>(),
 *   })
 * })
 *
 * const keys = defineKeyHierarchy({
 *   users: userKeyModule,
 *   posts: postKeyModule
 * })
 * ```
 */
export function defineKeyHierarchyModule<T extends KeyHierarchyConfig<T>>(configOrBuilder: ConfigOrBuilder<T>): T {
  return resolveConfigOrBuilder(configOrBuilder)
}

/**
 * Helper function to define dynamic key segments with a single argument.
 * @returns A function that can be extended with nested configuration or used as a leaf node.
 * @example
 * ```ts
 * defineKeyHierarchy({
 *   getAll: true,
 *   byGroup: dynamic<{ groupId: string }>(),
 *   byId: dynamic<string>().extend({ get: true, update: true }),
 *   byMonth: dynamic<number>().extend({
 *     byDay: dynamic<number>(),
 *   }),
 *   byAuthorAndYear: dynamic<{ authorId: string, year: number }>(),
 *   byTags: dynamic<{ tags: string[], filter?: PostFilter }>(),
 * })
 * ```
 */
function dynamicHelper<T>(): DynamicLeafWithExtend<T> {
  return {
    [DYNAMIC_LEAF]: undefined as any as T,
    extend<U extends KeyHierarchyConfig<U>>(config: U): DynamicExtend<T, U> {
      return {
        [DYNAMIC_EXTEND]: undefined as any as T,
        ...config,
      }
    },
  } as DynamicLeafWithExtend<T>
}
