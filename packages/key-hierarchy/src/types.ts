/**
 * Represents a key hierarchy for a given object type.
 * Dynamically derived based on a provided {@link KeyHierarchyConfig}.
 */
export type KeyHierarchy<
  T,
  Path extends readonly unknown[] = [],
> = {
    readonly [K in keyof T as K extends InternalKeys
    ? never
    : K extends number
    ? `${K}`
    : K]:
    // 1) dynamic *extend*: property is a function that accepts Arg and returns a nested hierarchy
    T[K] extends DynamicExtend<infer Arg, infer U>
    ? (arg: Arg) => KeyHierarchy<
      U,
      readonly [...Path, readonly [K extends number ? `${K}` : K, DeepReadonly<Arg>]]
    > & {
      readonly __key: readonly [...Path, readonly [K extends number ? `${K}` : K, DeepReadonly<Arg>]]
    }

    // 2) dynamic *leaf*: property is a function that accepts Arg and returns the final tuple
    : T[K] extends DynamicLeaf<infer Arg>
    ? (arg: Arg) => readonly [...Path, readonly [K extends number ? `${K}` : K, DeepReadonly<Arg>]]

    // 3) nested (normal object) => recurse and expose __key
    : T[K] extends object
    ? KeyHierarchy<
      T[K],
      readonly [...Path, K extends number ? `${K}` : K]
    > & {
      readonly __key: readonly [...Path, K extends number ? `${K}` : K]
    }

    // 4) plain leaf (true) => final tuple
    : readonly [...Path, K extends number ? `${K}` : K]
  }

export const DYNAMIC_LEAF = Symbol('DynamicLeaf')

export interface DynamicLeaf<T> {
  readonly [DYNAMIC_LEAF]: T
}

export const DYNAMIC_EXTEND = Symbol('DynamicExtend')

export type DynamicExtend<T, U extends KeyHierarchyConfig<U>> = U & {
  readonly [DYNAMIC_EXTEND]: T
}

export type DynamicLeafWithExtend<T> = DynamicLeaf<T> & {
  extend: <U extends KeyHierarchyConfig<U>>(config: U) => DynamicExtend<T, U>
}

type InternalKeys = '__key' | typeof DYNAMIC_LEAF | typeof DYNAMIC_EXTEND

/**
 * Declarative configuration of a key hierarchy.
 * @remarks **Note:** May not contain `__key` as a property at any place.
 */
export type KeyHierarchyConfig<T> =
  '__key' extends keyof T ? never
  : {
    [K in keyof T as K extends InternalKeys ? never : K]:
    T[K] extends DynamicLeaf<infer Arg>
    ? DynamicLeafWithExtend<Arg>
    : T[K] extends DynamicExtend<infer Arg, infer U>
    ? DynamicExtend<Arg, U>
    // eslint-disable-next-line ts/no-unsafe-function-type
    : T[K] extends Function
    ? never
    : T[K] extends object
    ? KeyHierarchyConfig<T[K]>
    : true
  }

/**
 * Options for a key hierarchy.
 */
export interface KeyHierarchyOptions {
  /**
   * If enabled, all key arrays and their elements will be deeply frozen.
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
   * `precompute` computes the key hierarchy upfront.
   * @defaultValue 'proxy'
   */
  method?: 'proxy' | 'precompute'
}

/**
 * Represents a deeply readonly ver sion of a type.
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
