import { describe, expect, expectTypeOf, it } from 'vitest'
import { defineKeyHierarchy } from '~/index'
import type { DeepReadonly } from '~/index'
import { keyModule } from '~test/modules/key-module'
import { TEST_AUTHOR_ID, TEST_DAY, TEST_ID, TEST_MONTH, TEST_POST_FILTER, TEST_SYMBOL, TEST_TAGS, TEST_USER, TEST_YEAR } from '~test/modules/test-data'
import type { User, PostFilter } from '~test/modules/types'

const keys = defineKeyHierarchy(keyModule, { freeze: true, method: 'precompute' })

describe('defineKeyHierarchy', () => {
  it('posts.__key', () => {
    const key = keys.posts.__key
    expect(key).toStrictEqual(['posts'])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts']>()
  })

  it('posts.getAll', () => {
    const key = keys.posts.getAll
    expect(key).toStrictEqual(['posts', 'getAll'])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', 'getAll']>()
  })

  it('posts.create', () => {
    const key = keys.posts.create
    expect(key).toStrictEqual(['posts', 'create'])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', 'create']>()
  })

  it('posts.byId(TEST_ID).__key', () => {
    const key = keys.posts.byId(TEST_ID).__key
    expect(key).toStrictEqual(['posts', ['byId', TEST_ID]])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byId', string]]>()
  })

  it('posts.byId(TEST_ID).get', () => {
    const key = keys.posts.byId(TEST_ID).get
    expect(key).toStrictEqual(['posts', ['byId', TEST_ID], 'get'])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byId', string], 'get']>()
  })

  it('posts.byId(TEST_ID).delete', () => {
    const key = keys.posts.byId(TEST_ID).delete
    expect(key).toStrictEqual(['posts', ['byId', TEST_ID], 'delete'])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byId', string], 'delete']>()
  })

  it('posts.byId(TEST_ID).update', () => {
    const key = keys.posts.byId(TEST_ID).update
    expect(key).toStrictEqual(['posts', ['byId', TEST_ID], 'update'])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byId', string], 'update']>()
  })

  it('posts.byUser(TEST_USER).__key', () => {
    const key = keys.posts.byUser(TEST_USER).__key
    expect(key).toStrictEqual(['posts', ['byUser', TEST_USER]])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byUser', DeepReadonly<User>]]>()
  })

  it('posts.byUser(TEST_USER).getAll', () => {
    const key = keys.posts.byUser(TEST_USER).getAll
    expect(key).toStrictEqual(['posts', ['byUser', TEST_USER], 'getAll'])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byUser', DeepReadonly<User>], 'getAll']>()
  })

  it('posts.byUser(TEST_USER).delete', () => {
    const key = keys.posts.byUser(TEST_USER).delete
    expect(key).toStrictEqual(['posts', ['byUser', TEST_USER], 'delete'])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byUser', DeepReadonly<User>], 'delete']>()
  })

  it('posts.byMonth(TEST_MONTH).__key', () => {
    const key = keys.posts.byMonth(TEST_MONTH).__key
    expect(key).toStrictEqual(['posts', ['byMonth', TEST_MONTH]])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byMonth', number]]>()
  })

  it('posts.byMonth(TEST_MONTH).byDay(TEST_DAY)', () => {
    const key = keys.posts.byMonth(TEST_MONTH).byDay(TEST_DAY)
    expect(key).toStrictEqual(['posts', ['byMonth', TEST_MONTH], ['byDay', TEST_DAY]])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byMonth', number], readonly ['byDay', number]]>()
  })

  it('posts.byAuthorAndYear(TEST_AUTHOR_ID, TEST_YEAR)', () => {
    const key = keys.posts.byAuthorAndYear(TEST_AUTHOR_ID, TEST_YEAR)
    expect(key).toStrictEqual(['posts', ['byAuthorAndYear', TEST_AUTHOR_ID, TEST_YEAR]])
    expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byAuthorAndYear', string, number]]>()
  })

  it('posts.byTags(TEST_TAGS)', () => {
    const key = keys.posts.byTags(TEST_TAGS)
    expect(key).toStrictEqual(['posts', ['byTags', TEST_TAGS]])
    expectTypeOf(key[0]).toEqualTypeOf<'posts'>()
    expectTypeOf(key[1][0]).toEqualTypeOf<'byTags'>()
    expectTypeOf(key[1][1]).toEqualTypeOf<DeepReadonly<string[]>>()
    expectTypeOf(key[1][2]).toEqualTypeOf<DeepReadonly<PostFilter> | undefined>()
  })

  it('posts.byTags(TEST_TAGS, TEST_POST_FILTER)', () => {
    const key = keys.posts.byTags(TEST_TAGS, TEST_POST_FILTER)
    expect(key).toStrictEqual(['posts', ['byTags', TEST_TAGS, TEST_POST_FILTER]])
    expectTypeOf(key[0]).toEqualTypeOf<'posts'>()
    expectTypeOf(key[1][0]).toEqualTypeOf<'byTags'>()
    expectTypeOf(key[1][1]).toEqualTypeOf<DeepReadonly<string[]>>()
    expectTypeOf(key[1][2]).toEqualTypeOf<DeepReadonly<PostFilter> | undefined>()
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
      const key = keys.posts.byUser(TEST_USER).delete as unknown as [unknown, unknown[]]
      expect(() => key.push('newKey')).toThrowError(TypeError)
      expect(() => key[0] = 'newKey').toThrowError(TypeError)
    })

    it('nested tuples are frozen', () => {
      const key = keys.posts.byUser(TEST_USER).delete as unknown as [unknown, unknown[], unknown]
      expect(() => key[1].push('newKey')).toThrowError(TypeError)
      expect(() => key[1][1] = 'newKey').toThrowError(TypeError)
    })

    it('object arguments are frozen', () => {
      const user = { ...TEST_USER }
      const newUserName = `${user.name}-new`
      const key = keys.posts.byUser(user).delete
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
      const key = keys.posts.byTags(tags)
      // @ts-expect-error We know that tags are readonly
      expect(() => key[1][1][0] = newTag).toThrowError()
      expect(tags, 'Tags were mutated').toStrictEqual(TEST_TAGS)
      // Original argument is not frozen
      expect(() => tags[0] = newTag).not.toThrowError()
      expect(tags[0]).toBe(newTag)
    })
  })
})
