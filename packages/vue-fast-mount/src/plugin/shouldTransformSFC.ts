import { FAST_MOUNT_QUERY_KEY, FAST_MOUNT_QUERY_VALUE } from './shared'

export function shouldTransformSFC(id: string): boolean {
  if (!id.includes('.vue') || !id.includes('?')) {
    return false
  }

  const query = id.slice(id.indexOf('?') + 1)
  if (!new RegExp(`(?:^|&)${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}(?:&|$)`).test(query)) {
    return false
  }

  return !/(?:^|&)type=/.test(query)
}
