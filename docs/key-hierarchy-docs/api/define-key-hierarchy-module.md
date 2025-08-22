# defineKeyHierarchyModule

The `defineKeyHierarchyModule` function allows you to define reusable key hierarchy modules that can be composed together in larger applications. This is particularly useful for organizing keys in modular applications or libraries.

## Parameters

### `configOrBuilder`

- **Type:** `ConfigOrBuilder<T>`
- **Required:** Yes

The configuration for your key hierarchy module. This can be either:

#### **Configuration object** (for static keys only)

```typescript
const keys = defineKeyHierarchyModule({
  users: {
    getAll: true,
    create: true,
  },
  config: true,
})
```

#### **Configuration builder function** (for dynamic keys)

```typescript
const keys = defineKeyHierarchyModule((dynamic) => ({
  users: {
    getAll: true,
    byId: dynamic<number>().extend({
      get: true,
      update: true,
    }),
  },
}))
```

## Return Value

A key hierarchy module that must be used within a `defineKeyHierarchy` call. Modules cannot be used standalone.

## Examples

### Basic Usage

```typescript
import { defineKeyHierarchy, defineKeyHierarchyModule } from 'key-hierarchy'

// Define a users module
const usersModule = defineKeyHierarchyModule((dynamic) => ({
  getAll: true,
  create: true,
  byId: dynamic<number>().extend({
    get: true,
    update: true,
    delete: true,
  }),
}))

// Modules must be used within a hierarchy
const keys = defineKeyHierarchy({
  users: usersModule,
})

// Now you can use the keys
const getAllUsersKey = keys.users.getAll
// → readonly ['users', 'getAll']

const getUserKey = keys.users.byId(42).get
// → readonly ['users', ['byId', number], 'get']
```

### Composing Modules

Modules can be composed together to create larger key hierarchies:

```typescript
import { defineKeyHierarchy, defineKeyHierarchyModule } from 'key-hierarchy'

// Define individual modules
const usersModule = defineKeyHierarchyModule((dynamic) => ({
  getAll: true,
  create: true,
  byId: dynamic<number>().extend({
    get: true,
    update: true,
    delete: true,
  }),
}))

const postsModule = defineKeyHierarchyModule((dynamic) => ({
  getAll: true,
  create: true,
  byUserId: dynamic<number>(),
  byId: dynamic<number>().extend({
    get: true,
    update: true,
    delete: true,
    comments: {
      getAll: true,
      create: true,
    },
  }),
}))

// Compose modules into a main hierarchy
const keys = defineKeyHierarchy({
  users: usersModule,
  posts: postsModule,
})

// Use composed keys
const getAllUsersKey = keys.users.getAll
// → readonly ['users', 'getAll']

const getPostCommentsKey = keys.posts.byId(123).comments.getAll
// → readonly ['posts', ['byId', number], 'comments', 'getAll']
```

### Library Usage

Modules are particularly useful when creating libraries that need to provide reusable key structures:

```typescript
// In your library
import { defineKeyHierarchyModule } from 'key-hierarchy'

export const authModule = defineKeyHierarchyModule((dynamic) => ({
  user: {
    get: true,
    login: true,
    logout: true,
    refresh: true,
  },
  permissions: {
    getAll: true,
    byRole: dynamic<string>(),
  },
}))

// In consuming applications
import { defineKeyHierarchy } from 'key-hierarchy'
import { authModule } from 'my-auth-library'

// The module must be placed within a hierarchy
const keys = defineKeyHierarchy({
  auth: authModule,
  // ... other app-specific keys
})

// Now you can use the auth keys
const loginKey = keys.auth.user.login
// → readonly ['auth', 'user', 'login']
```
