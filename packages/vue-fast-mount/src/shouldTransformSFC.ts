import { FAST_MOUNT_QUERY_KEY, FAST_MOUNT_QUERY_VALUE } from './utils'

export function shouldTransformSFC(params: URLSearchParams): boolean {
  const query = params.get(FAST_MOUNT_QUERY_KEY)
  return query === FAST_MOUNT_QUERY_VALUE
}
