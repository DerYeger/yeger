# Introduction

The `key-hierarchy` package provides a type-safe, structured approach to managing query keys for TanStack Query and similar libraries.

## The Problem

Managing query keys manually is error-prone:

```typescript
// Manual key management - inconsistent and fragile
const userKeys = ['users', userId]
const userPostsKeys = ['users', userId, 'posts']
const wrongKey = ['user', userId] // Typo!
```

## The Solution

Define your key structure once, get type-safe keys everywhere:

```typescript
import { defineKeyHierarchy } from 'key-hierarchy'

const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    getAll: true,
    byId: dynamic<number>().extend({
      get: true,
      posts: true,
    }),
  },
}))

// Type-safe, consistent keys
keys.users.getAll           // ['users', 'getAll']
keys.users.byId(123).get    // ['users', ['byId', 123], 'get']
```

## Key Benefits

- **Type-Safety**: Compile-time checking for all query keys
- **Consistency**: No more typos or inconsistent formats
- **Discoverability**: IDE autocomplete shows available keys
- **Collision-free**: No more accidental key collisions
