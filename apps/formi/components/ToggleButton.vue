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
      class="toggle__line w-12 h-6 bg-gray-200 rounded-full shadow-inner"
      @click="emit('update:input', !input)"
    />
    <div
      class="toggle__dot absolute w-5 h-5 bg-white rounded-full shadow inset-y-0 left-0"
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
