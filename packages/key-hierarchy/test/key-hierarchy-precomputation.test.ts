import { describe, expect, expectTypeOf, it } from 'vitest'
import { defineKeyHierarchy } from '~/index'
import type { DeepReadonly } from '~/index'

const TEST_SYMBOL = Symbol('test')

interface User {
  id: string
  name: string
}

interface TodoFilter {
  hidden?: boolean
  favorite?: boolean
}

const TEST_ID = 'test-id'

const TEST_USER: User = {
  id: 'test-user-id',
  name: 'test-name',
}

const TEST_YEAR = 2025
const TEST_MONTH = 6
const TEST_DAY = 15

const TEST_AUTHOR_ID = 'test-author-id'

const TEST_TODO_FILTER: TodoFilter = {
  hidden: true,
}

const TEST_TAGS = ['test-tag-1', 'test-tag-2']

const keys = defineKeyHierarchy({
  todos: {
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
    byTags: (_tags: string[], _filter?: TodoFilter) => true,
  },
  users: {
    getAll: true,
    create: true,
    byId: (_id: string) => ({
      get: true,
      delete: true,
      update: true,
    }),
  },
  [TEST_SYMBOL]: {
    test: true,
  },
  5: {
    test: true,
  },
  '6': {
    test: true,
  },
}, { freeze: true, method: 'precompute' })

describe('defineKeyHierarchy', () => {
  it('todos.__key', () => {
    const key = keys.todos.__key
    expect(key).toStrictEqual(['todos'])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos']>()
  })

  it('todos.getAll', () => {
    const key = keys.todos.getAll
    expect(key).toStrictEqual(['todos', 'getAll'])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', 'getAll']>()
  })

  it('todos.create', () => {
    const key = keys.todos.create
    expect(key).toStrictEqual(['todos', 'create'])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', 'create']>()
  })

  it('todos.byId(TEST_ID).__key', () => {
    const key = keys.todos.byId(TEST_ID).__key
    expect(key).toStrictEqual(['todos', ['byId', TEST_ID]])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byId', string]]>()
  })

  it('todos.byId(TEST_ID).get', () => {
    const key = keys.todos.byId(TEST_ID).get
    expect(key).toStrictEqual(['todos', ['byId', TEST_ID], 'get'])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byId', string], 'get']>()
  })

  it('todos.byId(TEST_ID).delete', () => {
    const key = keys.todos.byId(TEST_ID).delete
    expect(key).toStrictEqual(['todos', ['byId', TEST_ID], 'delete'])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byId', string], 'delete']>()
  })

  it('todos.byId(TEST_ID).update', () => {
    const key = keys.todos.byId(TEST_ID).update
    expect(key).toStrictEqual(['todos', ['byId', TEST_ID], 'update'])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byId', string], 'update']>()
  })

  it('todos.byUser(TEST_USER).__key', () => {
    const key = keys.todos.byUser(TEST_USER).__key
    expect(key).toStrictEqual(['todos', ['byUser', TEST_USER]])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byUser', DeepReadonly<User>]]>()
  })

  it('todos.byUser(TEST_USER).getAll', () => {
    const key = keys.todos.byUser(TEST_USER).getAll
    expect(key).toStrictEqual(['todos', ['byUser', TEST_USER], 'getAll'])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byUser', DeepReadonly<User>], 'getAll']>()
  })

  it('todos.byUser(TEST_USER).delete', () => {
    const key = keys.todos.byUser(TEST_USER).delete
    expect(key).toStrictEqual(['todos', ['byUser', TEST_USER], 'delete'])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byUser', DeepReadonly<User>], 'delete']>()
  })

  it('todos.byMonth(TEST_MONTH).__key', () => {
    const key = keys.todos.byMonth(TEST_MONTH).__key
    expect(key).toStrictEqual(['todos', ['byMonth', TEST_MONTH]])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byMonth', number]]>()
  })

  it('todos.byMonth(TEST_MONTH).byDay(TEST_DAY)', () => {
    const key = keys.todos.byMonth(TEST_MONTH).byDay(TEST_DAY)
    expect(key).toStrictEqual(['todos', ['byMonth', TEST_MONTH], ['byDay', TEST_DAY]])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byMonth', number], readonly ['byDay', number]]>()
  })

  it('todos.byAuthorAndYear(TEST_AUTHOR_ID, TEST_YEAR)', () => {
    const key = keys.todos.byAuthorAndYear(TEST_AUTHOR_ID, TEST_YEAR)
    expect(key).toStrictEqual(['todos', ['byAuthorAndYear', TEST_AUTHOR_ID, TEST_YEAR]])
    expectTypeOf(key).toEqualTypeOf<readonly ['todos', readonly ['byAuthorAndYear', string, number]]>()
  })

  it('todos.byTags(TEST_TAGS)', () => {
    const key = keys.todos.byTags(TEST_TAGS)
    expect(key).toStrictEqual(['todos', ['byTags', TEST_TAGS]])
    expectTypeOf(key[0]).toEqualTypeOf<'todos'>()
    expectTypeOf(key[1][0]).toEqualTypeOf<'byTags'>()
    expectTypeOf(key[1][1]).toEqualTypeOf<DeepReadonly<string[]>>()
    expectTypeOf(key[1][2]).toEqualTypeOf<DeepReadonly<TodoFilter> | undefined>()
  })

  it('todos.byTags(TEST_TAGS, TEST_TODO_FILTER)', () => {
    const key = keys.todos.byTags(TEST_TAGS, TEST_TODO_FILTER)
    expect(key).toStrictEqual(['todos', ['byTags', TEST_TAGS, TEST_TODO_FILTER]])
    expectTypeOf(key[0]).toEqualTypeOf<'todos'>()
    expectTypeOf(key[1][0]).toEqualTypeOf<'byTags'>()
    expectTypeOf(key[1][1]).toEqualTypeOf<DeepReadonly<string[]>>()
    expectTypeOf(key[1][2]).toEqualTypeOf<DeepReadonly<TodoFilter> | undefined>()
  })

  it('users.__key', () => {
    const key = keys.users.__key
    expect(key).toStrictEqual(['users'])
    expectTypeOf(key).toEqualTypeOf<readonly ['users']>()
  })

  it('users.getAll', () => {
    const key = keys.users.getAll
    expect(key).toStrictEqual(['users', 'getAll'])
    expectTypeOf(key).toEqualTypeOf<readonly ['users', 'getAll']>()
  })

  it('users.create', () => {
    const key = keys.users.create
    expect(key).toStrictEqual(['users', 'create'])
    expectTypeOf(key).toEqualTypeOf<readonly ['users', 'create']>()
  })

  it('users.byId(TEST_ID).__key', () => {
    const key = keys.users.byId(TEST_ID).__key
    expect(key).toStrictEqual(['users', ['byId', TEST_ID]])
    expectTypeOf(key).toEqualTypeOf<readonly ['users', readonly ['byId', string]]>()
  })

  it('users.byId(TEST_ID).get', () => {
    const key = keys.users.byId(TEST_ID).get
    expect(key).toStrictEqual(['users', ['byId', TEST_ID], 'get'])
    expectTypeOf(key).toEqualTypeOf<readonly ['users', readonly ['byId', string], 'get']>()
  })

  it('users.byId(TEST_ID).delete', () => {
    const key = keys.users.byId(TEST_ID).delete
    expect(key).toStrictEqual(['users', ['byId', TEST_ID], 'delete'])
    expectTypeOf(key).toEqualTypeOf<readonly ['users', readonly ['byId', string], 'delete']>()
  })

  it('users.byId(TEST_ID).update', () => {
    const key = keys.users.byId(TEST_ID).update
    expect(key).toStrictEqual(['users', ['byId', TEST_ID], 'update'])
    expectTypeOf(key).toEqualTypeOf<readonly ['users', readonly ['byId', string], 'update']>()
  })

  describe('symbol keys', () => {
    it('[TEST_SYMBOL].__key', () => {
      const key = keys[TEST_SYMBOL].__key
      expect(key).toStrictEqual([TEST_SYMBOL])
      expectTypeOf(key).toEqualTypeOf<readonly [typeof TEST_SYMBOL]>()
    })

    it('[TEST_SYMBOL].test', () => {
      const key = keys[TEST_SYMBOL].test
      expect(key).toStrictEqual([TEST_SYMBOL, 'test'])
      expectTypeOf(key).toEqualTypeOf<readonly [typeof TEST_SYMBOL, 'test']>()
    })
  })

  describe('number keys', () => {
    it('[5].__key', () => {
      const key = keys[5].__key
      expect(key).toStrictEqual(['5'])
      expectTypeOf(key).toEqualTypeOf<readonly ['5']>()
    })

    it('[5].test', () => {
      const key = keys[5].test
      expect(key).toStrictEqual(['5', 'test'])
      expectTypeOf(key).toEqualTypeOf<readonly ['5', 'test']>()
    })
  })

  describe('numeric string keys', () => {
    it(`['6'].__key`, () => {
      const key = keys['6'].__key
      expect(key).toStrictEqual(['6'])
      expectTypeOf(key).toEqualTypeOf<readonly ['6']>()
    })

    it(`users['6'].test`, () => {
      const key = keys['6'].test
      expect(key).toStrictEqual(['6', 'test'])
      expectTypeOf(key).toEqualTypeOf<readonly ['6', 'test']>()
    })
  })

  describe('immutability', () => {
    it('__key is frozen', () => {
      const key = keys.users.__key as unknown as unknown[]
      expect(() => key.push('newKey')).toThrowError(TypeError)
      expect(() => key[0] = 'newKey').toThrowError(TypeError)
    })

    it('tuples are frozen', () => {
      const key = keys.todos.byUser(TEST_USER).delete as unknown as [unknown, unknown[]]
      expect(() => key.push('newKey')).toThrowError(TypeError)
      expect(() => key[0] = 'newKey').toThrowError(TypeError)
    })

    it('nested tuples are frozen', () => {
      const key = keys.todos.byUser(TEST_USER).delete as unknown as [unknown, unknown[], unknown]
      expect(() => key[1].push('newKey')).toThrowError(TypeError)
      expect(() => key[1][1] = 'newKey').toThrowError(TypeError)
    })

    it('object arguments are frozen', () => {
      const user = { ...TEST_USER }
      const newUserName = `${user.name}-new`
      const key = keys.todos.byUser(user).delete
      // @ts-expect-error We know that tags are readonly
      expect(() => key[1][1].name = newUserName).toThrowError()
      expect(user, 'User was mutated').toStrictEqual(TEST_USER)
      // Original argument is not frozen
      expect(() => user.name = newUserName).not.toThrowError()
      expect(user.name).toBe(newUserName)
    })

    it('array arguments are frozen', () => {
      const tags = [...TEST_TAGS]
      const newTag = `${tags[0]}-new`
      const key = keys.todos.byTags(tags)
      // @ts-expect-error We know that tags are readonly
      expect(() => key[1][1][0] = newTag).toThrowError()
      expect(tags, 'Tags were mutated').toStrictEqual(TEST_TAGS)
      // Original argument is not frozen
      expect(() => tags[0] = newTag).not.toThrowError()
      expect(tags[0]).toBe(newTag)
    })
  })
})
