import { describe, expectTypeOf, test } from 'vitest'

import type { DeepReadonly } from '../src/index'
import { defineKeyHierarchy } from '../src/index'
import { keyModule } from './modules/key-module'
import {
  TEST_AUTHOR_ID,
  TEST_DAY,
  TEST_ID,
  TEST_MONTH,
  TEST_POST_FILTER,
  TEST_SYMBOL,
  TEST_TAGS,
  TEST_USER,
  TEST_YEAR,
} from './modules/test-data'
import type { User, PostFilter } from './modules/types'

describe('defineKeyHierarchy', () => {
  describe.each(['proxy', 'precompute'] as const)('method: %s', (method) => {
    describe.each([
      ['with freeze', true],
      ['without freeze', false],
    ] as const)('%s', (_, freeze) => {
      const keys = defineKeyHierarchy(keyModule, { freeze, method })

      describe('post module', () => {
        test('posts.__key', ({ expect }) => {
          const key = keys.posts.__key
          expect(key).toStrictEqual(['posts'])
          expectTypeOf(key).toEqualTypeOf<readonly ['posts']>()
        })

        test('posts.getAll', ({ expect }) => {
          const key = keys.posts.getAll
          expect(key).toStrictEqual(['posts', 'getAll'])
          expectTypeOf(key).toEqualTypeOf<readonly ['posts', 'getAll']>()
        })

        test('posts.create', ({ expect }) => {
          const key = keys.posts.create
          expect(key).toStrictEqual(['posts', 'create'])
          expectTypeOf(key).toEqualTypeOf<readonly ['posts', 'create']>()
        })

        test('posts.byId(TEST_ID).__key', ({ expect }) => {
          const key = keys.posts.byId(TEST_ID).__key
          expect(key).toStrictEqual(['posts', ['byId', TEST_ID]])
          expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byId', string]]>()
        })

        test('posts.byId(TEST_ID).get', ({ expect }) => {
          const key = keys.posts.byId(TEST_ID).get
          expect(key).toStrictEqual(['posts', ['byId', TEST_ID], 'get'])
          expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byId', string], 'get']>()
        })

        test('posts.byId(TEST_ID).delete', ({ expect }) => {
          const key = keys.posts.byId(TEST_ID).delete
          expect(key).toStrictEqual(['posts', ['byId', TEST_ID], 'delete'])
          expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byId', string], 'delete']>()
        })

        test('posts.byId(TEST_ID).update', ({ expect }) => {
          const key = keys.posts.byId(TEST_ID).update
          expect(key).toStrictEqual(['posts', ['byId', TEST_ID], 'update'])
          expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byId', string], 'update']>()
        })

        test('posts.byUser(TEST_USER).__key', ({ expect }) => {
          const key = keys.posts.byUser(TEST_USER).__key
          expect(key).toStrictEqual(['posts', ['byUser', TEST_USER]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['posts', readonly ['byUser', DeepReadonly<User>]]
          >()
        })

        test('posts.byUser(TEST_USER).getAll', ({ expect }) => {
          const key = keys.posts.byUser(TEST_USER).getAll
          expect(key).toStrictEqual(['posts', ['byUser', TEST_USER], 'getAll'])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['posts', readonly ['byUser', DeepReadonly<User>], 'getAll']
          >()
        })

        test('posts.byUser(TEST_USER).delete', ({ expect }) => {
          const key = keys.posts.byUser(TEST_USER).delete
          expect(key).toStrictEqual(['posts', ['byUser', TEST_USER], 'delete'])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['posts', readonly ['byUser', DeepReadonly<User>], 'delete']
          >()
        })

        test('posts.byMonth(TEST_MONTH).__key', ({ expect }) => {
          const key = keys.posts.byMonth(TEST_MONTH).__key
          expect(key).toStrictEqual(['posts', ['byMonth', TEST_MONTH]])
          expectTypeOf(key).toEqualTypeOf<readonly ['posts', readonly ['byMonth', number]]>()
        })

        test('posts.byMonth(TEST_MONTH).byDay(TEST_DAY)', ({ expect }) => {
          const key = keys.posts.byMonth(TEST_MONTH).byDay(TEST_DAY)
          expect(key).toStrictEqual(['posts', ['byMonth', TEST_MONTH], ['byDay', TEST_DAY]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['posts', readonly ['byMonth', number], readonly ['byDay', number]]
          >()
        })

        test('posts.byAuthorAndYear(TEST_AUTHOR_ID, TEST_YEAR)', ({ expect }) => {
          const key = keys.posts.byAuthorAndYear({ authorId: TEST_AUTHOR_ID, year: TEST_YEAR })
          expect(key).toStrictEqual([
            'posts',
            ['byAuthorAndYear', { authorId: TEST_AUTHOR_ID, year: TEST_YEAR }],
          ])
          expectTypeOf(key).toEqualTypeOf<
            readonly [
              'posts',
              readonly ['byAuthorAndYear', DeepReadonly<{ authorId: string; year: number }>],
            ]
          >()
        })

        test('posts.byTags(TEST_TAGS)', ({ expect }) => {
          const key = keys.posts.byTags({ tags: TEST_TAGS })
          expect(key).toStrictEqual(['posts', ['byTags', { tags: TEST_TAGS }]])
          expectTypeOf(key[0]).toEqualTypeOf<'posts'>()
          expectTypeOf(key[1][0]).toEqualTypeOf<'byTags'>()
          expectTypeOf(key[1][1]).toEqualTypeOf<
            DeepReadonly<{ tags: string[]; filter?: PostFilter }>
          >()
        })

        test('posts.byTags(TEST_TAGS, TEST_POST_FILTER)', ({ expect }) => {
          const key = keys.posts.byTags({ tags: TEST_TAGS, filter: TEST_POST_FILTER })
          expect(key).toStrictEqual([
            'posts',
            ['byTags', { tags: TEST_TAGS, filter: TEST_POST_FILTER }],
          ])
          expectTypeOf(key[0]).toEqualTypeOf<'posts'>()
          expectTypeOf(key[1][0]).toEqualTypeOf<'byTags'>()
          expectTypeOf(key[1][1]).toEqualTypeOf<
            DeepReadonly<{ tags: string[]; filter?: PostFilter }>
          >()
        })

        test('users.__key', ({ expect }) => {
          const key = keys.users.__key
          expect(key).toStrictEqual(['users'])
          expectTypeOf(key).toEqualTypeOf<readonly ['users']>()
        })
      })

      describe('user module', () => {
        test('users.getAll', ({ expect }) => {
          const key = keys.users.getAll
          expect(key).toStrictEqual(['users', 'getAll'])
          expectTypeOf(key).toEqualTypeOf<readonly ['users', 'getAll']>()
        })

        test('users.create', ({ expect }) => {
          const key = keys.users.create
          expect(key).toStrictEqual(['users', 'create'])
          expectTypeOf(key).toEqualTypeOf<readonly ['users', 'create']>()
        })

        test('users.byId(TEST_ID).__key', ({ expect }) => {
          const key = keys.users.byId(TEST_ID).__key
          expect(key).toStrictEqual(['users', ['byId', TEST_ID]])
          expectTypeOf(key).toEqualTypeOf<readonly ['users', readonly ['byId', string]]>()
        })

        test('users.byId(TEST_ID).get', ({ expect }) => {
          const key = keys.users.byId(TEST_ID).get
          expect(key).toStrictEqual(['users', ['byId', TEST_ID], 'get'])
          expectTypeOf(key).toEqualTypeOf<readonly ['users', readonly ['byId', string], 'get']>()
        })

        test('users.byId(TEST_ID).delete', ({ expect }) => {
          const key = keys.users.byId(TEST_ID).delete
          expect(key).toStrictEqual(['users', ['byId', TEST_ID], 'delete'])
          expectTypeOf(key).toEqualTypeOf<readonly ['users', readonly ['byId', string], 'delete']>()
        })

        test('users.byId(TEST_ID).update', ({ expect }) => {
          const key = keys.users.byId(TEST_ID).update
          expect(key).toStrictEqual(['users', ['byId', TEST_ID], 'update'])
          expectTypeOf(key).toEqualTypeOf<readonly ['users', readonly ['byId', string], 'update']>()
        })
      })

      describe('argument type module', () => {
        test('argumentTypes.__key', ({ expect }) => {
          const key = keys.argumentTypes.__key
          expect(key).toStrictEqual(['argumentTypes'])
          expectTypeOf(key).toEqualTypeOf<readonly ['argumentTypes']>()
        })

        test('argumentTypes.null', ({ expect }) => {
          const key = keys.argumentTypes.null(null)
          expect(key).toStrictEqual(['argumentTypes', ['null', null]])
          expectTypeOf(key).toEqualTypeOf<readonly ['argumentTypes', readonly ['null', null]]>()
        })

        test('argumentTypes.undefined', ({ expect }) => {
          const key = keys.argumentTypes.undefined(undefined)
          expect(key).toStrictEqual(['argumentTypes', ['undefined', undefined]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['argumentTypes', readonly ['undefined', undefined]]
          >()
        })

        test('argumentTypes.true', ({ expect }) => {
          const key = keys.argumentTypes.true(true)
          expect(key).toStrictEqual(['argumentTypes', ['true', true]])
          expectTypeOf(key).toEqualTypeOf<readonly ['argumentTypes', readonly ['true', true]]>()
        })

        test('argumentTypes.false', ({ expect }) => {
          const key = keys.argumentTypes.false(false)
          expect(key).toStrictEqual(['argumentTypes', ['false', false]])
          expectTypeOf(key).toEqualTypeOf<readonly ['argumentTypes', readonly ['false', false]]>()
        })

        test('argumentTypes.number', ({ expect }) => {
          const key = keys.argumentTypes.number(42)
          expect(key).toStrictEqual(['argumentTypes', ['number', 42]])
          expectTypeOf(key).toEqualTypeOf<readonly ['argumentTypes', readonly ['number', number]]>()
        })

        test('argumentTypes.nan', ({ expect }) => {
          const key = keys.argumentTypes.nan(NaN)
          expect(key).toStrictEqual(['argumentTypes', ['nan', NaN]])
          expectTypeOf(key).toEqualTypeOf<readonly ['argumentTypes', readonly ['nan', number]]>()
        })

        test('argumentTypes.string', ({ expect }) => {
          const key = keys.argumentTypes.string('test')
          expect(key).toStrictEqual(['argumentTypes', ['string', 'test']])
          expectTypeOf(key).toEqualTypeOf<readonly ['argumentTypes', readonly ['string', string]]>()
        })

        test('argumentTypes.symbol', ({ expect }) => {
          const symbol = Symbol('test')
          const key = keys.argumentTypes.symbol(symbol)
          expect(key).toStrictEqual(['argumentTypes', ['symbol', symbol]])
          expectTypeOf(key).toEqualTypeOf<readonly ['argumentTypes', readonly ['symbol', symbol]]>()
        })

        test('argumentTypes.function', ({ expect }) => {
          const myFunction = (input: string) => {
            return input.length
          }
          ;(myFunction as any).secretProperty = 'test'
          const key = keys.argumentTypes.function(myFunction)
          expect(key).toStrictEqual(['argumentTypes', ['function', myFunction]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['argumentTypes', readonly ['function', typeof myFunction]]
          >()
        })

        test('argumentTypes.date', ({ expect }) => {
          const myDate = new Date()
          const key = keys.argumentTypes.date(myDate)
          expect(key).toStrictEqual(['argumentTypes', ['date', myDate]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['argumentTypes', readonly ['date', DeepReadonly<Date>]]
          >()
        })

        test('argumentTypes.map', ({ expect }) => {
          const myMap = new Map<string, number>()
          const key = keys.argumentTypes.map(myMap)
          expect(key).toStrictEqual(['argumentTypes', ['map', myMap]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['argumentTypes', readonly ['map', DeepReadonly<typeof myMap>]]
          >()
        })

        test('argumentTypes.set', ({ expect }) => {
          const mySet = new Set<string>()
          const key = keys.argumentTypes.set(mySet)
          expect(key).toStrictEqual(['argumentTypes', ['set', mySet]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['argumentTypes', readonly ['set', DeepReadonly<typeof mySet>]]
          >()
        })

        test('argumentTypes.array', ({ expect }) => {
          const myArray = [1, 2, 3]
          const key = keys.argumentTypes.array(myArray)
          expect(key).toStrictEqual(['argumentTypes', ['array', myArray]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['argumentTypes', readonly ['array', DeepReadonly<typeof myArray>]]
          >()
        })

        test('argumentTypes.object', ({ expect }) => {
          const myObject: Record<string, number> = { a: 1, b: 2 }
          const key = keys.argumentTypes.object(myObject)
          expect(key).toStrictEqual(['argumentTypes', ['object', myObject]])
          expectTypeOf(key).toEqualTypeOf<
            readonly ['argumentTypes', readonly ['object', DeepReadonly<typeof myObject>]]
          >()
        })
      })

      describe('other modules', () => {
        describe('symbol keys', () => {
          test('[TEST_SYMBOL].__key', ({ expect }) => {
            const key = keys[TEST_SYMBOL].__key
            expect(key).toStrictEqual([TEST_SYMBOL])
            expectTypeOf(key).toEqualTypeOf<readonly [typeof TEST_SYMBOL]>()
          })

          test('[TEST_SYMBOL].test', ({ expect }) => {
            const key = keys[TEST_SYMBOL].test
            expect(key).toStrictEqual([TEST_SYMBOL, 'test'])
            expectTypeOf(key).toEqualTypeOf<readonly [typeof TEST_SYMBOL, 'test']>()
          })
        })

        describe('number keys', () => {
          test('[5].__key', ({ expect }) => {
            const key = keys[5].__key
            expect(key).toStrictEqual(['5'])
            expectTypeOf(key).toEqualTypeOf<readonly ['5']>()
          })

          test('[5].test', ({ expect }) => {
            const key = keys[5].test
            expect(key).toStrictEqual(['5', 'test'])
            expectTypeOf(key).toEqualTypeOf<readonly ['5', 'test']>()
          })
        })

        describe('numeric string keys', () => {
          test(`['6'].__key`, ({ expect }) => {
            const key = keys['6'].__key
            expect(key).toStrictEqual(['6'])
            expectTypeOf(key).toEqualTypeOf<readonly ['6']>()
          })

          test(`users['6'].test`, ({ expect }) => {
            const key = keys['6'].test
            expect(key).toStrictEqual(['6', 'test'])
            expectTypeOf(key).toEqualTypeOf<readonly ['6', 'test']>()
          })
        })
      })

      // oxlint-disable-next-line no-conditional-tests
      if (freeze) {
        describe('immutability', () => {
          test('__key is frozen', ({ expect }) => {
            const key = keys.users.__key
            // @ts-expect-error We know that a key is readonly
            expect(() => key.push('newKey')).toThrowError(TypeError)
            // @ts-expect-error We know that a key is readonly
            expect(() => (key[0] = 'newKey')).toThrowError(TypeError)
          })

          test('tuples are frozen', ({ expect }) => {
            const key = keys.posts.byUser(TEST_USER).delete
            // @ts-expect-error We know that tuples are readonly
            expect(() => key.push('newKey')).toThrowError(TypeError)
            // @ts-expect-error We know that tuples are readonly
            expect(() => (key[0] = 'newKey')).toThrowError(TypeError)
          })

          test('nested tuples are frozen', ({ expect }) => {
            const key = keys.posts.byUser(TEST_USER).delete
            // @ts-expect-error We know that tuples are readonly
            expect(() => key[1].push('newKey')).toThrowError(TypeError)
            // @ts-expect-error We know that tuples are readonly
            expect(() => (key[1][1] = 'newKey')).toThrowError(TypeError)
          })

          test('object arguments are frozen', ({ expect }) => {
            const user = { ...TEST_USER }
            const newUserName = `${user.name}-new`
            const key = keys.posts.byUser(user).delete
            // @ts-expect-error We know that user is readonly
            expect(() => (key[1][1].name = newUserName)).toThrowError(TypeError)
            expect(user, 'User was mutated').toStrictEqual(TEST_USER)
            // Original argument is not frozen
            expect(() => (user.name = newUserName)).not.toThrowError()
            expect(user.name).toBe(newUserName)
          })

          test('array arguments are frozen', ({ expect }) => {
            const tags = [...TEST_TAGS]
            const newTag = `${tags[0]}-new`
            const key = keys.posts.byTags({ tags })
            // @ts-expect-error We know that tags are readonly
            expect(() => (key[1][1].tags[0] = newTag)).toThrowError(TypeError)
            expect(tags, 'Tags were mutated').toStrictEqual(TEST_TAGS)
            // Original argument is not frozen
            expect(() => (tags[0] = newTag)).not.toThrowError()
            expect(tags[0]).toBe(newTag)
          })
        })
      }
    })
  })
})
