import { FAST_MOUNT_QUERY_KEY, FAST_MOUNT_QUERY_VALUE } from './shared'

const FAST_MOUNT_QUERY_MATCHER = new RegExp(
  `(?:^|&)${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}(?:&|$)`,
)
const TYPE_QUERY_MATCHER = /(?:^|&)type=/

export function shouldTransformSFC(id: string): boolean {
  if (!id.includes('.vue') || !id.includes('?')) {
    return false
  }

  const query = id.slice(id.indexOf('?') + 1)
  if (!FAST_MOUNT_QUERY_MATCHER.test(query)) {
    return false
  }

  return !TYPE_QUERY_MATCHER.test(query)
}
