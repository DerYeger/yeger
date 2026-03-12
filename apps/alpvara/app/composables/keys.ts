import { defineKeyHierarchy } from 'key-hierarchy'

export const queryKeys = defineKeyHierarchy((dynamic) => ({
  portfolios: {
    bav: {
      all: true,
      byId: dynamic<string | undefined>().extend({
        accounts: true,
        byAccountId: dynamic<string | undefined>().extend({
          history: true,
        }),
      }),
    },
  },
}))
