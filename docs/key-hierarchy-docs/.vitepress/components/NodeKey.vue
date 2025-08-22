<script setup lang="ts">
defineProps<{
  value: readonly unknown[]
  partial?: boolean
}>()
</script>

<template>
  <span class="node-key" :class="{ partial }">
    <code>{{ JSON.stringify(value) }}</code>
  </span>
</template>

<style scoped>
.node-key {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  border: 1px solid var(--vp-c-border);
  display: inline-flex;
  align-items: center;
  white-space: pre;
}

.node-key code {
  color: inherit;
  background: transparent;
  padding: 0;
  font-size: inherit;
}

.node-key.partial {
  color: #7c3aed; /* violet-600 */
  background: rgba(124, 58, 237, 0.08);
  border-color: #c4b5fd; /* violet-300 */
}

html.dark .node-key.partial {
  color: #c4b5fd; /* violet-300 */
  background: rgba(139, 92, 246, 0.12);
  border-color: #8b5cf6; /* violet-500 */
}
</style>
