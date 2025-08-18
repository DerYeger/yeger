/**
 * Represents a key hierarchy for a given object type.
 * Dynamically derived based on a provided {@link KeyHierarchyConfig}.
 */
export type KeyHierarchy<T, Path extends readonly unknown[] = []> = {
  readonly [K in keyof T as K extends number ? `${K}` : K]: T[K] extends (arg: infer Arg) => infer R
  ? (arg: Arg) => R extends object
    ? KeyHierarchy<R, [...Path, readonly [K extends number ? `${K}` : K, Arg]]> & { readonly __key: DeepReadonly<readonly [...Path, readonly [K extends number ? `${K}` : K, Arg]]> }
    : DeepReadonly<readonly [...Path, readonly [K extends number ? `${K}` : K, Arg]]>
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
    [K in keyof T]: T[K] extends (arg: infer Arg) => infer R
    ? (arg: Arg) => R extends object
      ? KeyHierarchyConfig<R> | true
      : true
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
   * `precompute` computes the key hierarchy upfront. For this to work, all functions for dynamic key segments must be callable with `undefined` dummy arguments and do not have side effects.
   * @defaultValue 'proxy'
   */
  method?: 'proxy' | 'precompute'
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
