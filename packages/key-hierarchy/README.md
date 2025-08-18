<h1 align="center">key-hierarchy</h1>

<p align="center">
    A tiny TypeScript library for managing key hierarchies. The perfect companion for <a href="https://tanstack.com/query/latest">TanStack Query</a>.
</p>

<p align="center">
  <a href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/DerYeger/yeger/ci.yml?branch=main&label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/key-hierarchy">
    <img alt="NPM" src="https://img.shields.io/npm/v/key-hierarchy?logo=npm">
  </a>
  <a href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/key-hierarchy">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=key-hierarchy">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/key-hierarchy?color=%234DC71F">
  </a>
</p>

## Features

- **Centralized** key management for [TanStack Query](https://tanstack.com/query/latest)
- **Collision-free** by design
- **Declarative** API
- **Type safe** dynamic keys

## Installation

```bash
# pnpm
$ pnpm add key-hierarchy

# yarn
$ yarn add key-hierarchy

# npm
$ npm install key-hierarchy
```

## Usage

This library provides a declarative API for defining key hierarchies.
Key hierarchies can contain both static and dynamic segments, with dynamic segments being defined through functions and their parameters.

This approach and API ensure type safety and collision-free key management.
With this centralized declaration of keys, no key collisions can occur, and all keys are guaranteed to be unique.
As such, it is ideal for managing [TanStack Query](https://tanstack.com/query/latest) `queryKey`s in large applications with multiple developers.

```ts
import { defineKeyHierarchy } from 'key-hierarchy'

const keys = defineKeyHierarchy({
  users: {
    getAll: true,
    create: true,
    byId: (_id: number) => ({
      get: true,
      update: true,
      delete: true,
    }),
  },
  posts: {
    byUserId: (_userId: number) => true,
  },
})

// Static keys
const getAllUsersKey = keys.users.getAll // readonly ['users', 'getAll']

// Dynamic keys with continued hierarchy
const updateUserKey = keys.users.byId(42).update // readonly ['users', ['byId', number], 'update']

// Partial keys with `__key`
const userByIdKey = keys.users.byId(42).__key // readonly ['users', ['byId', number]]

// Dynamic keys as terminal segment
const postsByUserIdKey = keys.posts.byUserId(42) // readonly ['posts', ['byUserId', number]]
```

### Modularization

Should key hierarchy definitions grow too big to manage them within a single file, `defineKeyHierarchyModule` can be used to create modular key hierarchies.
Defining modules this way retains type inference and ensures that keys are still unique when accessed from the root hierarchy.

```ts
// user-keys.ts
import { defineKeyHierarchyModule } from 'key-hierarchy'

export const userKeyModule = defineKeyHierarchyModule({
  getAll: true,
  create: true
  byId: (_id: number) => ({
    get: true,
    update: true,
    delete: true,
  })
})

// post-keys.ts
import { defineKeyHierarchyModule } from 'key-hierarchy'

export const postKeyModule = defineKeyHierarchyModule({
  byIdUserId: (_userId: number) => true
})

// keys.ts
import { defineKeyHierarchy } from 'key-hierarchy'

export const keys = defineKeyHierarchy({
  users: userKeyModule,
  posts: postKeyModule
})
```

### Options

The following options can be configured through the optional second parameter of `defineKeyHierarchy`.
All options are optional with default values as described below.

#### `freeze: boolean`

> Defaults to `false`.

If set to `true`, the generated keys will be frozen, preventing any modifications. This ensures immutability at runtime in your key hierarchy.

- The return type of `defineKeyHierarchy` already prevents modification in TypeScript, even with `freeze: false`.
- `Object.freeze()` will be called on the generated keys and all nested objects or arrays.
- `structuredClone` will be used to create a deep copy of any key arguments before freezing them to ensure the original arguments remain unchanged.

```ts
import { defineKeyHierarchy } from 'key-hierarchy'

const key = defineKeyHierarchy({
  posts: {
    create: true,
    byUser: (_user: { id: number }) => true,
  },
}, { freeze: true })

// Throws with `freeze: true`
keys.posts.create.push('newSegment') 

// Prevents modifications with `freeze: true`
keys.posts.create = ['newSegment']

// Prevents modification of arguments
const postsByUserKey = keys.posts.byUser({ id: 42 }) // readonly ['posts', ['byUser', DeepReadonly<{ id: number }>]]
// Throws with `freeze: true`
postsByUserKey[1][1].id = 7
```

#### `method: 'proxy' | 'precompute'`

> Defaults to `'proxy'`.

By default, the key hierarchy is created dynamically with `Proxy` objects.
If this is not suitable, the `method: 'precompute'` option can be used to generate the keys at build time instead of runtime.

- This can improve performance in scenarios where the key hierarchy is large or complex.
- But, it requires calling the functions of all dynamic segments with dummy arguments (`undefined`) within the library. Thus, it will break if the functions expect arguments to match the declared parameter types.
- If `method: 'precompute'` is used, the functions should not have any side-effects and never access the arguments.

### TanStack Query Integration

This library works seamlessly with TanStack Query.
Below are examples for React and Vue.

#### @tanstack/react-query

```ts
import { useQuery } from '@tanstack/react-query'
import { defineKeyHierarchy } from 'key-hierarchy'

const keys = defineKeyHierarchy({
  users: {
    byId: (_id: number) => ({
      get: true
    })
  }
})

export function useUserByIdQuery(userId: number) {
  return useQuery({
    queryKey: keys.users.byId(userId).get,
    queryFn: () => fetchUserById(userId)
  })
}
```

#### @tanstack/vue-query

> **Important:** When using `defineKeyHierarchy` with `@tanstack/vue-query`, the `freeze` option may not be `true` if query key arguments are reactive.

```ts
import { useQuery } from '@tanstack/vue-query'
import { defineKeyHierarchy } from 'key-hierarchy'
import { MaybeRefOrGetter, toValue } from 'vue'

const keys = defineKeyHierarchy({
  users: {
    byId: (_id: MaybeRefOrGetter<number>) => ({
      get: true
    })
  }
})

export function useUserByIdQuery(userId: MaybeRefOrGetter<number>) {
  return useQuery({
    queryKey: keys.users.byId(userId).get,
    queryFn: () => fetchUserById(toValue(userId))
  })
}
```

## Development

```bash
# install dependencies
$ pnpm install

# build for production
$ pnpm build

# lint project files
$ pnpm lint

# run tests
$ pnpm test
```

## License

[MIT](https://github.com/DerYeger/yeger/blob/main/packages/key-hierarchy/LICENSE) - Copyright &copy; Jan Müller
