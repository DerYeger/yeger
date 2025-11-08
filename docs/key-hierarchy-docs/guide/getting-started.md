# Getting Started

This guide will help you install and set up `key-hierarchy` in your project.

## Installation

::: code-group

```bash [pnpm]
pnpm add key-hierarchy
```

```bash [yarn]
yarn add key-hierarchy
```

```bash [npm]
npm install key-hierarchy
```

:::

## Usage

### Defining a key hierarchy

Let's create a simple key hierarchy for a blog application:

```typescript
import { defineKeyHierarchy } from 'key-hierarchy'

// Define your key hierarchy
const keys = defineKeyHierarchy((dynamic) => ({
  posts: {
    getAll: true,
    byId: dynamic<number>().extend({
      get: true,
      comments: true,
    }),
  },
  users: {
    getAll: true,
    byId: dynamic<string>().extend({
      get: true,
      posts: true,
    }),
  },
}))

// Use the keys
console.log(keys.posts.getAll)
// Output: ['posts', 'getAll']

console.log(keys.posts.byId(42).get)
// Output: ['posts', ['byId', 42], 'get']

console.log(keys.users.byId('user123').posts)
// Output: ['users', ['byId', 'user123'], 'posts']
```

### Using a key hierarchy

The `defineKeyHierarchy` function returns an object that generates arrays representing your keys:

- **Static keys** like `keys.posts.getAll` return simple arrays: `['posts', 'getAll']`
- **Dynamic keys** like `keys.posts.byId(42).get` return arrays with tuple segments: `['posts', ['byId', 42], 'get']`

These arrays are perfect for use with TanStack Query's `queryKey` parameter.

### Type-safety

When using TypeScript, `key-hierarchy` provides full type-safety:

```typescript
// ✅ Type-safe - knows this should be a number
const postKey = keys.posts.byId(42).get

// ❌ Type error - string provided where number expected
const invalidKey = keys.posts.byId('invalid').get

// ✅ IntelliSense shows available methods
keys.posts.byId(42). // IDE will show: get, comments, __key
```

## Basic Patterns

### Static Keys

Static keys are the simplest form - they represent fixed endpoints:

```typescript
const keys = defineKeyHierarchy({
  posts: {
    getAll: true, // → ['posts', 'getAll']
    create: true, // → ['posts', 'create']
  },
  config: true, // → ['config']
})
```

### Dynamic Keys

Dynamic keys accept parameters and can optionally be extended with nested keys:

```typescript
const keys = defineKeyHierarchy((dynamic) => ({
  posts: {
    // Dynamic key as terminal (end of hierarchy)
    byTag: dynamic<string>(), // Usage: keys.posts.byTag('tech')

    // Dynamic key with extensions
    byId: dynamic<number>().extend({
      get: true, // Usage: keys.posts.byId(42).get
      update: true, // Usage: keys.posts.byId(42).update
    }),
  },
}))
```

### Partial Keys

Sometimes you need access to partial keys (the key up to a certain point):

```typescript
const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    byId: dynamic<number>().extend({
      get: true,
      posts: true,
    }),
  },
}))

// Get the partial key for a user (without the final action)
const userPartialKey = keys.users.byId(42).__key
// Output: ['users', ['byId', 42]]
```

### Performance Considerations

By default, `key-hierarchy` uses Proxy objects for less overhead during initialization.
If you need maximum runtime performance, consider using the `precompute` method:

```typescript
const keys = defineKeyHierarchy(config, { method: 'precompute' })
```
