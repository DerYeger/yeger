<script setup lang="ts">
import { computed } from 'vue'
import TreeNode from './TreeNode.vue'

interface Props {
  label: string
  keyFunction: (param: string) => readonly unknown[]
  level?: number
  placeholder: string
  partial?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '⚙️',
})
const inputValue = defineModel<string>({ required: true })

const keyValue = computed(() => props.keyFunction(inputValue.value || props.placeholder))
</script>

<template>
  <TreeNode
    :level="level"
    :partial="props.partial"
    :key-value="keyValue"
    :icon="props.icon"
    variant="dynamic"
  >
    {{ label }}(
    <input
      v-model="inputValue"
      :placeholder="placeholder"
      class="inline-input"
      type="text"
    >)
  </TreeNode>
</template>

<style scoped>
.inline-input {
  display: inline-block;
  width: 10rem;
  padding: 0.125rem 0.25rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 0.25rem;
  font-family: var(--vp-font-family-mono);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  margin-right: 0.25rem;
}

.inline-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-1);
}

.inline-input::placeholder {
  color: var(--vp-c-text-3);
}
</style>
