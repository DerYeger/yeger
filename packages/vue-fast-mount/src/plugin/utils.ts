import { default as babelTraverse } from '@babel/traverse'
import type { babelParse } from 'vue/compiler-sfc'

export const traverse: typeof babelTraverse =
  // @ts-expect-error
  typeof babelTraverse === 'function' ? babelTraverse : babelTraverse.default

export const FAST_MOUNT_QUERY_KEY = '__vfm'
export const FAST_MOUNT_QUERY_VALUE = '1'
export const FAST_MOUNT_UNSTUB_QUERY_KEY = `${FAST_MOUNT_QUERY_KEY}_unstub`

export type ParseResult = ReturnType<typeof babelParse>

export type PropType = 'unknown' | 'boolean'

export type ComponentMetadata = {
  props: Map<string, PropType>
  emits: Set<string>
}

export type Components = Map<string, ComponentMetadata>
