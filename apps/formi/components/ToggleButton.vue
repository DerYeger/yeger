<script setup lang="ts">
const props = defineProps<{ input: boolean }>()

const emit = defineEmits(['update:input'])

const { input } = toRefs(props)

// From: https://codepen.io/ciruz/pen/bGBaQOP
</script>

<template>
  <div class="relative">
    <input id="foobar3" type="checkbox" class="hidden" :checked="input" />
    <div
      class="toggle__line h-6 w-12 rounded-full bg-gray-200 shadow-inner"
      @click="emit('update:input', !input)"
    />
    <div
      class="toggle__dot absolute inset-y-0 left-0 size-5 rounded-full bg-white shadow"
      @click="emit('update:input', !input)"
    />
  </div>
</template>

<style scoped>
.toggle__dot {
  top: 2px;
  left: 3.5px;
  transition: all 0.3s ease-in-out;
}

input:checked ~ .toggle__dot {
  transform: translateX(100%);
  left: 5px;
  background-color: var(--green);
}
</style>
