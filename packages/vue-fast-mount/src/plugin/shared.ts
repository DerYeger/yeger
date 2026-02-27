export const FAST_MOUNT_QUERY_KEY = '__vfm'
export const FAST_MOUNT_QUERY_VALUE = '1'
export const FAST_MOUNT_KEEP_QUERY_KEY = '__vfm_keep'

export function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
