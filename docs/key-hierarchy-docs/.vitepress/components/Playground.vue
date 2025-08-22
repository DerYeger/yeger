<script setup lang="ts">
import { defineKeyHierarchy } from 'key-hierarchy'
import { ref } from 'vue'
import StaticTreeNode from './StaticTreeNode.vue'
import DynamicTreeNode from './DynamicTreeNode.vue'

// Define the actual key hierarchy using the library
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

// Reactive values for dynamic segments
const userId = ref('user-123')
const postId = ref('post-456')
</script>

<template>
  <div class="key-hierarchy-demo">
    <StaticTreeNode
      label="users"
      :key-value="keys.users.__key"
      :level="0"
      partial
    />
    <StaticTreeNode
      label="getAll"
      :key-value="keys.users.getAll"
      :level="1"
    />
    <StaticTreeNode
      label="create"
      :key-value="keys.users.create"
      :level="1"
    />

    <!-- Dynamic byId with extensions -->
    <DynamicTreeNode
      v-model="userId"
      label="byId"
      :key-function="(id) => keys.users.byId(id).__key"
      placeholder="User ID"
      :level="1"
      partial
    />

    <!-- Extended keys under byId -->
    <StaticTreeNode
      label="get"
      :key-value="keys.users.byId(userId).get"
      :level="2"
    />
    <StaticTreeNode
      label="update"
      :key-value="keys.users.byId(userId).update"
      :level="2"
    />
    <StaticTreeNode
      label="delete"
      :key-value="keys.users.byId(userId).delete"
      :level="2"
    />

    <!-- Posts under byId, shown like a static node (no container background or collapse) -->
    <StaticTreeNode
      label="posts"
      :key-value="keys.users.byId(userId).posts.byId(postId).__key"
      :level="2"
      partial
    />
    <StaticTreeNode
      label="getAll"
      :key-value="keys.users.byId(userId).posts.getAll"
      :level="3"
    />
    <DynamicTreeNode
      v-model="postId"
      label="byId"
      :key-function="(id) => keys.users.byId(userId).posts.byId(id).__key"
      placeholder="Post ID"
      :level="3"
      partial
    />
    <StaticTreeNode
      label="get"
      :key-value="keys.users.byId(userId).posts.byId(postId).get"
      :level="4"
    />
    <StaticTreeNode
      label="update"
      :key-value="keys.users.byId(userId).posts.byId(postId).update"
      :level="4"
    />
    <StaticTreeNode
      label="delete"
      :key-value="keys.users.byId(userId).posts.byId(postId).delete"
      :level="4"
    />
  </div>
</template>

<style scoped>
.key-hierarchy-demo {
  font-family: var(--vp-font-family-base);
  border: 1px solid var(--vp-c-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: var(--vp-c-bg-soft);
  font-size: 0.7rem;
  max-width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
