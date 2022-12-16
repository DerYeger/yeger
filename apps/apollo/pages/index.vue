<script setup lang="ts">
import { FOL } from '@yeger/fol'

const formulaInput = ref('exists x. forall y. f(x) = g(x,y) -> x = y')

const matchResult = computed(() => FOL.match(formulaInput.value))
const formula = computed(() =>
  matchResult.value?.succeeded()
    ? FOL.parse(formulaInput.value).get()
    : undefined
)
</script>

<template>
  <main class="flex flex-col gap-4 pa-4 bg-stone-100 min-h-100vh">
    <div class="flex flex-col gap-2">
      <label for="formulaInput">Input</label>
      <input
        v-model="formulaInput"
        name="formulaInput"
        class="px-2 py-1 bg-white rounded border-stone-900 border-1"
      />
    </div>
    <div class="flex flex-col gap-2">
      <span>Formula</span>
      <code
        class="px-2 py-1 border-current border-1 text-stone-500 overflow-x-auto"
      >
        {{ formula?.toFormattedString() ?? 'Invalid' }}
      </code>
    </div>
    <div class="flex flex-col gap-2">
      <span>Error</span>
      <pre
        class="px-2 py-1 border-current border-1 text-stone-500 overflow-x-auto"
        >{{ matchResult.message ?? 'None' }}</pre
      >
    </div>
    <div v-if="formula" class="flex flex-col gap-2">
      <span>Tree</span>
      <div class="border-current border-1 text-stone-500 overflow-x-auto">
        <FormulaTree :tree="formula" :level="0" :max-depth="formula.depth()" />
      </div>
    </div>
  </main>
</template>
