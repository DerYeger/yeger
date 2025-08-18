import { defineKeyHierarchyModule } from '~/index'

export const userModule = defineKeyHierarchyModule({
  getAll: true,
  create: true,
  byId: (_id: string) => ({
    get: true,
    delete: true,
    update: true,
  }),
})
