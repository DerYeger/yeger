/**
 * Represents a key hierarchy for a given object type.
 * Dynamically derived based on a provided {@link KeyHierarchyConfig}.
 */
export type KeyHierarchy<T, Path extends readonly unknown[] = []> = {
  readonly [K in keyof T as K extends InternalKeys
    ? never
    : K extends number
      ? `${K}`
      : K]: T[K] extends DynamicExtendedSegment<infer Arg, infer U> // 1) dynamic *extend*: property is a function that accepts Arg and returns a nested hierarchy
    ? (arg: Arg) => KeyHierarchy<
        U,
        readonly [...Path, readonly [K extends number ? `${K}` : K, DeepReadonly<Arg>]]
      > & {
        readonly __key: readonly [
          ...Path,
          readonly [K extends number ? `${K}` : K, DeepReadonly<Arg>],
        ]
      }
    : // 2) dynamic *leaf*: property is a function that accepts Arg and returns the final tuple
      T[K] extends DynamicSegment<infer Arg>
      ? (
          arg: Arg,
        ) => readonly [...Path, readonly [K extends number ? `${K}` : K, DeepReadonly<Arg>]]
      : // 3) nested (normal object) => recurse and expose __key
        T[K] extends object
        ? KeyHierarchy<T[K], readonly [...Path, K extends number ? `${K}` : K]> & {
            readonly __key: readonly [...Path, K extends number ? `${K}` : K]
          }
        : // 4) plain leaf (true) => final tuple
          readonly [...Path, K extends number ? `${K}` : K]
}

export const DYNAMIC_SEGMENT: unique symbol = Symbol('DynamicSegment')

export interface DynamicSegment<T> {
  readonly [DYNAMIC_SEGMENT]: T
}

export const DYNAMIC_EXTENDED_SEGMENT: unique symbol = Symbol('DynamicExtendedSegment')

export type DynamicExtendedSegment<T, U extends KeyHierarchyConfig<U>> = U & {
  readonly [DYNAMIC_EXTENDED_SEGMENT]: T
}

export type DynamicExtendableSegment<T> = DynamicSegment<T> & {
  /**
   * Extends the dynamic segment with a nested configuration.
   * @param config - The nested configuration to extend the dynamic segment with.
   * @returns The extended dynamic segment.
   */
  extend: <U extends KeyHierarchyConfig<U>>(config: U) => DynamicExtendedSegment<T, U>
}

type InternalKeys = '__key' | typeof DYNAMIC_SEGMENT | typeof DYNAMIC_EXTENDED_SEGMENT

/**
 * Declarative configuration of a key hierarchy.
 * @remarks **Note:** May not contain `__key` as a property at any place.
 */
export type KeyHierarchyConfig<T> = '__key' extends keyof T
  ? never
  : {
      [K in keyof T as K extends InternalKeys ? never : K]: T[K] extends DynamicSegment<infer Arg>
        ? DynamicExtendableSegment<Arg>
        : T[K] extends DynamicExtendedSegment<infer Arg, infer U>
          ? DynamicExtendedSegment<Arg, U>
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
 * Represents a deeply readonly version of a type.
 */
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
    ? T
    : T extends object
      ? DeepReadonlyObject<T>
      : T

/**
 * Represents a deeply readonly version of an array.
 */
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

/**
 * Represents a deeply readonly version of an object.
 */
export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}
