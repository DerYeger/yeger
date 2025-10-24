import { defineKeyHierarchyModule } from '../../src/index'

export const argumentTypeModule = defineKeyHierarchyModule((dynamic) => ({
  null: dynamic<null>(),
  undefined: dynamic<undefined>(),
  true: dynamic<true>(),
  false: dynamic<false>(),
  number: dynamic<number>(),
  nan: dynamic<number>(),
  string: dynamic<string>(),
  symbol: dynamic<symbol>(),
  function: dynamic<(input: string) => number>(),
  date: dynamic<Date>(),
  map: dynamic<Map<string, number>>(),
  set: dynamic<Set<string>>(),
  array: dynamic<Array<number>>(),
  object: dynamic<Record<string, number>>(),
}))
