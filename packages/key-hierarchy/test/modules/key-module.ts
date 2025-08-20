import { defineKeyHierarchyModule } from '~/index'
import { argumentTypeModule } from '~test/modules/argument-type-module'
import { postModule } from '~test/modules/posts-module'
import { TEST_SYMBOL } from '~test/modules/test-data'
import { userModule } from '~test/modules/user-module'

const otherModules = defineKeyHierarchyModule({
  [TEST_SYMBOL]: {
    test: true,
  },
  5: {
    test: true,
  },
  '6': {
    test: true,
  },
})

export const keyModule = defineKeyHierarchyModule({
  posts: postModule,
  users: userModule,
  argumentTypes: argumentTypeModule,
  ...otherModules,
})
