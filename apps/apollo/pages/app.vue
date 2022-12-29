<script setup lang="ts">
import type { Model, ModelCheckerMode } from '@yeger/fol'
import { FOL, Validator } from '@yeger/fol'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const minPaneSize = 5

const { formula: demoFormula } = useDemoData()

const formulaInput = ref(demoFormula)

definePageMeta({
  layout: 'empty',
})

useHead({
  meta: [{ name: 'theme-color', content: '#e7e5e4' }],
  htmlAttrs: {
    class: 'bg-stone-200',
  },
})

const parseResult = computed(() => FOL.parse(formulaInput.value))
const formula = computed(() => parseResult.value.getOrUndefined())
const formulaError = computed(() => parseResult.value.getErrorOrUndefined())
const formattedFormula = computed(
  () => formula.value?.toFormattedString() ?? 'Invalid'
)

const model = ref<Model>()

const modelCheckerMode = ref<ModelCheckerMode>('lazy')

function onModeChange(eager: boolean) {
  modelCheckerMode.value = eager ? 'eager' : 'lazy'
}

const traceResult = computed(() => {
  const parsedFormula = formula.value
  const validModel = model.value
  if (!parsedFormula || !validModel) {
    return undefined
  }
  return FOL.trace(modelCheckerMode.value, true, validModel, parsedFormula)
})
const trace = computed(() => traceResult.value?.getOrUndefined())
const traceError = computed(() => traceResult.value?.getErrorOrUndefined())

const modelError = computed(() =>
  model.value
    ? Validator.validateModel(model.value).getErrorOrUndefined()
    : undefined
)
</script>

<template>
  <div class="bg-stone-300 text-stone-900 h-full flex flex-col font-ui">
    <Toolbar />
    <main class="bg-stone-100 flex-1 min-h-0">
      <Splitpanes class="default-theme">
        <Pane :min-size="minPaneSize">
          <Splitpanes class="default-theme" horizontal>
            <Pane :min-size="minPaneSize" class="h-full w-full relative">
              <ModelInput @change="(newModel) => (model = newModel)" />
            </Pane>
            <Pane :min-size="minPaneSize" class="relative flex flex-col">
              <PaneTitle>Model Graph</PaneTitle>
              <ModelGraph v-if="model" :model="model" class="flex-1" />
              <Warning
                v-if="modelError"
                class="absolute left-0 bottom-0 right-0"
                >{{ modelError }}</Warning
              >
            </Pane>
          </Splitpanes>
        </Pane>
        <Pane :min-size="minPaneSize">
          <Splitpanes class="default-theme" horizontal>
            <Pane :min-size="minPaneSize" class="relative text-sm">
              <PaneTitle>Formula Input</PaneTitle>
              <div
                class="h-full w-full flex flex-col gap-4 pa-4 overflow-y-auto"
              >
                <div class="flex flex-col gap-2 mt-2">
                  <label for="formulaInput" class="select-none">Input</label>
                  <input
                    id="formulaInput"
                    v-model="formulaInput"
                    name="formulaInput"
                    class="px-2 py-1 bg-white rounded border-stone-900 border-1 font-sans"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <span class="select-none">Formula</span>
                  <code
                    class="px-2 py-1 border-current border-1 flex items-center"
                  >
                    <span class="overflow-x-auto flex-1 text-stone-500">
                      {{ formattedFormula }}
                    </span>
                    <CopyButton :content="formattedFormula" />
                  </code>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="select-none">Eager Evaluation</label>
                  <ToggleButton
                    :input="modelCheckerMode === 'eager'"
                    @update:input="onModeChange"
                  />
                </div>
              </div>
            </Pane>
            <Pane :min-size="minPaneSize" class="text-stone-500 relative">
              <PaneTitle class="!text-stone-100">Formula Tree</PaneTitle>
              <div class="w-full h-full flex overflow-auto bg-stone-400">
                <div class="m-auto p-2">
                  <FOLTree
                    v-if="formula"
                    :fragment="formula"
                    :level="0"
                    :max-depth="formula.depth()"
                    class="text-xs"
                  />
                  <Error v-else-if="formulaError" class="rounded">
                    {{ formulaError }}
                  </Error>
                </div>
              </div>
            </Pane>
            <Pane :min-size="minPaneSize" class="text-stone-500 relative">
              <PaneTitle class="!text-stone-100">Model Checker</PaneTitle>
              <div class="w-full h-full flex overflow-auto bg-stone-400">
                <div class="m-auto p-2">
                  <ModelCheckerTraceTree
                    v-if="trace"
                    :trace="trace"
                    :level="0"
                    :max-depth="trace.depth()"
                    :is-root-mismatched="trace.actual !== trace.expected"
                    class="text-xs"
                  />
                  <Error v-else-if="traceError" class="rounded">
                    {{ traceError }}
                  </Error>
                  <Error v-else-if="!formula" class="rounded"
                    >Formula is invalid.</Error
                  >
                </div>
              </div>
            </Pane>
          </Splitpanes>
        </Pane>
      </Splitpanes>
    </main>
  </div>
</template>
