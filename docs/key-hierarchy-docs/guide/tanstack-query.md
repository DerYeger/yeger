# TanStack Query Integration

`key-hierarchy` is designed to work seamlessly with [TanStack Query](https://tanstack.com/query/latest/), providing type-safe, collision-free query keys that make managing cache invalidation and data fetching easier and more reliable.

## React

```typescript
import { defineKeyHierarchy } from 'key-hierarchy'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Define your key hierarchy
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
      },
    }),
  },
}))

// Use in queries
function useUserQueries(userId: number) {
  const userQuery = useQuery({
    queryKey: keys.users.byId(userId).get,
    queryFn: () => fetchUser(userId),
  })

  const userPostsQuery = useQuery({
    queryKey: keys.users.byId(userId).posts.getAll,
    queryFn: () => fetchUserPosts(userId),
  })

  // ...
}
```

## Vue

```typescript
import { defineKeyHierarchy } from 'key-hierarchy'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { MaybeRefOrGetter, toValue } from 'vue'

// Define your key hierarchy
const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    getAll: true,
    create: true,
    byId: dynamic<MaybeRefOrGetter<number>>().extend({
      get: true,
      update: true,
      delete: true,
      posts: {
        getAll: true,
      },
    }),
  },
}))

function useUserQueries(id: MaybeRefOrGetter<number>) {
  const userQuery = useQuery({
    queryKey: keys.users.byId(userId).get,
    queryFn: () => fetchUser(toValue(userId)),
  })

  const userPostsQuery = useQuery({
    queryKey: keys.users.byId(userId).posts.getAll,
    queryFn: () => fetchUserPosts(toValue(userId)),
  })

  // ...
}
```

## Cache Invalidation

One of the biggest benefits is precise cache invalidation. You can invalidate specific queries or use predicate functions for more complex invalidation patterns:

```typescript
function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      // Invalidate specific user queries
      queryClient.invalidateQueries({
        queryKey: keys.users.byId(updatedUser.id).get,
      })

      queryClient.invalidateQueries({
        queryKey: keys.users.byId(updatedUser.id).posts.getAll,
      })

      // Also invalidate the users list
      queryClient.invalidateQueries({
        queryKey: keys.users.getAll,
      })
    },
  })
}
```

### Predicate-based Invalidation

For more flexible invalidation patterns, you can use the `predicate` option:

```typescript
import { deepEqual } from 'fast-equals'

function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (deletedUserId) => {
      // Remove specific user queries
      queryClient.removeQueries({
        queryKey: keys.users.byId(deletedUserId).get,
      })

      queryClient.removeQueries({
        queryKey: keys.users.byId(deletedUserId).posts.getAll,
      })

      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: keys.users.getAll,
      })

      // Use predicate for more complex patterns
      queryClient.invalidateQueries({
        predicate: (query) => {
          const userQueryKey = keys.users.byId(deletedUserId)
          // Invalidate any sub-query for the deleted user
          return deepEqual(userQueryKey, query.queryKey.slice(0, userQueryKey.length))
        },
      })
    },
  })
}
```
