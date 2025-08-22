# Playground

## Example Key Hierarchy

```ts
import { defineKeyHierarchy } from 'key-hierarchy'

const keys = defineKeyHierarchy((dynamic) => ({
  users: {
    getAll: true,
    create: true,
    byId: dynamic<string>().extend({
      get: true,
      update: true,
      delete: true,
      posts: {
        getAll: true,
        byId: dynamic<string>().extend({
          get: true,
          update: true,
          delete: true,
        }),
      },
    }),
  },
}))
```

## Interactive Visualizer

<script setup>
import Playground from '../.vitepress/components/Playground.vue'
</script>

<Playground />

<style>
  .content,
  .content-container {
    max-width: 1200px !important;
  }
</style>
