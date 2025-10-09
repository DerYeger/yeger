import { parseAsBoolean, parseAsNativeArrayOf, parseAsString, useQueryState } from 'nuqs'

export function useTaskSelection() {
  return useQueryState('task', parseAsNativeArrayOf(parseAsString).withDefault([]))
}

export function useFilterInput() {
  return useQueryState('filter', parseAsString)
}

export function useForceFlag() {
  return useQueryState('force', parseAsBoolean.withDefault(false))
}
