import * as s from '@yeger/streams/sync'

export const FAST_MOUNT_QUERY_KEY = '__vfm'
export const FAST_MOUNT_QUERY_VALUE = '1'
export const FAST_MOUNT_KEEP_QUERY_KEY = '__vfm_keep'

export function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function toPascalCase(value: string): string {
  return s.join(
    s.pipe(
      value.split('-'),
      s.filterTruthy(),
      s.map((part) => part.charAt(0).toUpperCase() + part.slice(1)),
    ),
    '',
  )
}

export function toCamelCase(value: string): string {
  return value.replace(/-([a-zA-Z])/g, (_, character: string) => character.toUpperCase())
}

export function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}
