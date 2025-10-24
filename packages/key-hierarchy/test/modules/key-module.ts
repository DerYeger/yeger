import { defineKeyHierarchyModule } from '../../src/index'
import { argumentTypeModule } from './argument-type-module'
import { postModule } from './posts-module'
import { TEST_SYMBOL } from './test-data'
import { userModule } from './user-module'

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
