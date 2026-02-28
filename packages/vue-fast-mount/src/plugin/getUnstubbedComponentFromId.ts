import { FAST_MOUNT_KEEP_QUERY_KEY } from './shared'

export function getUnstubbedComponentFromId(id: string): Set<string> {
  const queryStart = id.indexOf('?')

  if (queryStart === -1) {
    return new Set<string>()
  }

  const params = new URLSearchParams(id.slice(queryStart + 1))
  const keep = params.get(FAST_MOUNT_KEEP_QUERY_KEY)

  if (!keep) {
    return new Set<string>()
  }

  return new Set(
    keep
      .split(',')
      .map((binding) => binding.trim())
      .filter(Boolean),
  )
}
