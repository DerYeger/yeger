import * as s from '@yeger/streams/sync'

import { FAST_MOUNT_UNSTUB_QUERY_KEY } from './utils'

export function getUnstubbedComponents(params: URLSearchParams): Set<string> {
  const unstubbedComponents = params.get(FAST_MOUNT_UNSTUB_QUERY_KEY)

  if (!unstubbedComponents) {
    return new Set<string>()
  }

  return s.toSet(
    s.pipe(
      unstubbedComponents.split(','),
      s.map((binding) => binding.trim()),
      s.filterTruthy(),
    ),
  )
}
