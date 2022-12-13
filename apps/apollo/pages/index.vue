<script setup lang="ts">
import { FOL } from '@yeger/fol'

const formulaInput = ref('tt || ff')

const matchResult = computed(() => FOL.match(formulaInput.value))
const formula = computed(() =>
  matchResult.value?.succeeded() ? FOL.parse(formulaInput.value) : undefined
)

const tree = computed(() => formula.value?.toTree())
</script>

<template>
  <main class="flex flex-col gap-4 pa-4 bg-stone-100 h-full">
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
      <pre class="px-2 py-1 border-current border-1 text-stone-500">{{
        formula?.toFormattedString() ?? 'Invalid'
      }}</pre>
    </div>
    <div class="flex flex-col gap-2">
      <span>Error</span>
      <pre class="px-2 py-1 border-current border-1 text-stone-500">{{
        matchResult.message ?? 'None'
      }}</pre>
    </div>
    <div class="flex flex-col gap-2">
      <FormulaTree v-if="tree" :tree="tree" :level="0" />
    </div>
  </main>
</template>
