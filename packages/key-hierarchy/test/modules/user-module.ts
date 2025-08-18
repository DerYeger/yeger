import { defineKeyHierarchyModule } from '~/index'

export const userModule = defineKeyHierarchyModule((dynamic) => ({
  getAll: true,
  create: true,
  byId: dynamic<string>().extend({
    get: true,
    delete: true,
    update: true,
  }),
}))
