<script setup lang="ts">
import NodeKey from './NodeKey.vue'

withDefaults(
  defineProps<{
    level?: number
    partial?: boolean
    keyValue: readonly unknown[]
    icon?: string
    variant?: 'static' | 'dynamic'
  }>(),
  {
    level: 0,
    partial: false,
    icon: '📄',
    variant: 'static',
  },
)
</script>

<template>
  <div class="tree-node" :class="[variant, { partial }]" :style="{ '--level': String(level) }">
    <span class="node-icon">{{ icon }}</span>
    <span class="node-label">
      <slot />
    </span>
    <NodeKey :value="keyValue" :partial="partial" />
  </div>
</template>

<style scoped>
.tree-node {
  margin-left: calc(var(--level) * 1.25rem);
  padding: 0.4rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  transition: all 0.2s ease;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  border-left: 2px solid var(--vp-c-green-1);
  white-space: pre;
  min-width: fit-content;
}

/* Variant styling */
.tree-node.static .node-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}

/* Partial variant tweaks: emphasize with violet border */
.tree-node.partial {
  border-left-color: #8b5cf6; /* violet-500 */
}

.tree-node.dynamic {
  border-left-color: #fbbf24;
  background: rgba(251, 191, 36, 0.05);
}
.tree-node.dynamic .node-label {
  font-weight: 500;
  color: #d97706;
}

.node-icon {
  font-size: 0.8rem;
}

.tree-node:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}
</style>
