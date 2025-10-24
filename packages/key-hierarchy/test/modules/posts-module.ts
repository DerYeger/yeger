import { defineKeyHierarchyModule } from '../../src/index'
import type { PostFilter, User } from './types'

export const postModule = defineKeyHierarchyModule((dynamic) => ({
  getAll: true,
  create: true,
  byId: dynamic<string>().extend({
    get: true,
    delete: true,
    update: true,
  }),
  byUser: dynamic<User>().extend({
    getAll: true,
    delete: true,
  }),
  byMonth: dynamic<number>().extend({
    byDay: dynamic<number>(),
  }),
  byAuthorAndYear: dynamic<{ authorId: string, year: number }>(),
  byTags: dynamic<{ tags: string[], filter?: PostFilter }>(),
}))
