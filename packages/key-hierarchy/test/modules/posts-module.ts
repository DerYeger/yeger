import { defineKeyHierarchyModule } from '~/index'
import type { PostFilter, User } from '~test/modules/types'

export const postModule = defineKeyHierarchyModule({
  getAll: true,
  create: true,
  byId: (_id: string) => ({
    get: true,
    delete: true,
    update: true,
  }),
  byUser: (_user: User) => ({
    getAll: true,
    delete: true,
  }),
  byMonth: (_month: number) => ({
    byDay: (_day: number) => true,
  }),
  byAuthorAndYear: (_authorId: string, _year: number) => true,
  byTags: (_tags: string[], _filter?: PostFilter) => true,
})
