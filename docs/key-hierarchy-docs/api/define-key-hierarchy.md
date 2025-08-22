# defineKeyHierarchy

The main function for creating a key hierarchy. It accepts a configuration and optional settings, returning a type-safe key hierarchy object.

## Parameters

### `configOrBuilder`

- **Type:** `ConfigOrBuilder<T>`
- **Required:** Yes

The configuration for your key hierarchy. This can be either:

#### **Configuration object** (for static keys only)

```typescript
const keys = defineKeyHierarchy({
  users: {
    getAll: true,
    create: true,
  },
  config: true,
})
```

#### **Configuration builder function** (for dynamic keys)

```typescript
const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    getAll: true,
    byId: dynamic<number>().extend({
      get: true,
      update: true,
    }),
  },
}))
```

### `options`

- **Type:** `KeyHierarchyOptions`
- **Required:** No
- **Default:** `{ freeze: false, method: 'proxy' }`

Optional configuration for the key hierarchy behavior.

#### `freeze: boolean`

- **Default:** `false`

When `true`, the generated keys are frozen to prevent modifications:

```typescript
const keys = defineKeyHierarchy(config, { freeze: true })

// ❌ Throws error with freeze: true
keys.users.getAll.push('newSegment')
```

#### `method: 'proxy' | 'precompute'`

- **Default:** `'proxy'`

Determines how keys are generated:

- `'proxy'`: Uses Proxy objects for on-demand key generation (default)
- `'precompute'`: Pre-generates all possible keys at creation time

```typescript
// Proxy method (default) - good for development and most use cases
const proxyKeys = defineKeyHierarchy(config, { method: 'proxy' })

// Precompute method - better runtime performance
const precomputeKeys = defineKeyHierarchy(config, { method: 'precompute' })
```

## Return Value

Returns a `KeyHierarchy<T>` object that provides type-safe access to your defined keys.

### Static Keys

Static keys return readonly arrays:

```typescript
const keys = defineKeyHierarchy({
  users: {
    getAll: true,
    create: true,
  },
})

keys.users.getAll   // readonly ['users', 'getAll']
keys.users.create   // readonly ['users', 'create']
```

### Dynamic Keys

Dynamic keys return functions that accept parameters and return readonly arrays:

```typescript
const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    byId: dynamic<number>(),
    byEmail: dynamic<string>(),
  },
}))

keys.users.byId(42)              // readonly ['users', ['byId', 42]]
keys.users.byEmail('user@ex.com') // readonly ['users', ['byEmail', 'user@ex.com']]
```

### Extended Dynamic Keys

Dynamic keys can be extended with additional key segments:

```typescript
const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    byId: dynamic<number>().extend({
      get: true,
      update: true,
      posts: true,
    }),
  },
}))

keys.users.byId(42).get     // readonly ['users', ['byId', 42], 'get']
keys.users.byId(42).update  // readonly ['users', ['byId', 42], 'update']
keys.users.byId(42).posts   // readonly ['users', ['byId', 42], 'posts']
```

### Partial Keys with `__key`

Access partial keys using the special `__key` property:

```typescript
const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    byId: dynamic<number>().extend({
      get: true,
      profile: {
        get: true,
        update: true,
      },
    }),
  },
}))

keys.users.byId(42).__key           // readonly ['users', ['byId', 42]]
keys.users.byId(42).profile.__key   // readonly ['users', ['byId', 42], 'profile']
```

## Examples

### Basic Usage

```typescript
import { defineKeyHierarchy } from 'key-hierarchy'

// Simple static keys
const keys = defineKeyHierarchy({
  health: true,
  config: {
    app: true,
    user: true,
  },
})

console.log(keys.health)        // ['health']
console.log(keys.config.app)    // ['config', 'app']
console.log(keys.config.user)   // ['config', 'user']
```

### Dynamic Key Usage

```typescript
const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    getAll: true,
    create: true,
    byId: dynamic<number>().extend({
      get: true,
      update: true,
      delete: true,
    }),
    search: dynamic<{ query: string; filters?: UserFilters }>(),
  },
  posts: {
    byUserId: dynamic<number>(),
    byTag: dynamic<string>(),
  },
}))

// Static keys
keys.users.getAll   // ['users', 'getAll']
keys.users.create   // ['users', 'create']

// Dynamic keys
keys.users.byId(42).get          // ['users', ['byId', 42], 'get']
keys.users.byId(42).update       // ['users', ['byId', 42], 'update']
keys.posts.byUserId(42)          // ['posts', ['byUserId', 42]]
keys.posts.byTag('javascript')   // ['posts', ['byTag', 'javascript']]

// Complex parameters
keys.users.search({ 
  query: 'john', 
  filters: { role: 'admin' } 
}) // ['users', ['search', { query: 'john', filters: { role: 'admin' } }]]
```

### Complex Hierarchies

```typescript
interface UserFilter {
  role?: 'admin' | 'user' | 'moderator'
  status?: 'active' | 'inactive'
  dateRange?: { start: Date; end: Date }
}

const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    getAll: true,
    create: true,
    byId: dynamic<number>().extend({
      get: true,
      update: true,
      delete: true,
      posts: {
        getAll: true,
        create: true,
        byId: dynamic<string>().extend({
          get: true,
          update: true,
          delete: true,
          comments: true,
        }),
      },
      followers: {
        getAll: true,
        add: true,
        remove: true,
      },
    }),
    byFilter: dynamic<UserFilter>(),
    search: dynamic<{ query: string; limit?: number }>(),
  },
  admin: {
    dashboard: true,
    users: {
      suspended: true,
      reported: true,
    },
  },
}))

// Nested dynamic keys
keys.users.byId(42).posts.byId('post-123').get
// ['users', ['byId', 42], 'posts', ['byId', 'post-123'], 'get']

// Complex filters
keys.users.byFilter({
  role: 'admin',
  status: 'active',
  dateRange: { start: new Date('2023-01-01'), end: new Date('2023-12-31') }
})
```

## Performance Considerations

### Method Selection

- **`'proxy'`**: Better for development, lower memory usage, slight runtime overhead
- **`'precompute'`**: Better for production, higher memory usage, faster runtime access

### Freeze Option

- **`freeze: false`**: Faster key creation, no protection against modification at runtime
- **`freeze: true`**: Slower key creation due to deep freezing, protection against modification. May cause issues with some argument types for `dynamic` key segments.
