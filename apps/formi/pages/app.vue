<script setup lang="ts">
import type { Model } from '@yeger/fol'
import { FOL, Validator } from '@yeger/fol'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const minPaneSize = 5

const modelInput = useModelInput()
const formulaInput = useFormulaInput()

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
const formattedFormula = computed(() => formula.value?.toFormattedString() ?? 'Invalid')

const model = ref<Model>()

const modelCheckerMode = useModelCheckerMode()

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
  model.value ? Validator.validateModel(model.value).getErrorOrUndefined() : undefined,
)

const { loading } = useAppStorage()
</script>

<template>
  <div class="font-ui flex h-full flex-col bg-stone-300 text-stone-900">
    <Toolbar :loading="loading" />
    <main class="min-h-0 flex-1 bg-stone-100">
      <Splitpanes class="default-theme">
        <Pane :min-size="minPaneSize">
          <Splitpanes class="default-theme" horizontal>
            <Pane :min-size="minPaneSize" class="relative size-full">
              <ModelInput v-model="modelInput" v-model:model="model" />
            </Pane>
            <Pane :min-size="minPaneSize" class="relative flex flex-col">
              <PaneTitle>Model Graph</PaneTitle>
              <ModelGraph v-if="model" :model="model" class="flex-1" />
              <Warning v-if="modelError" class="absolute inset-x-0 bottom-0">
                {{ modelError }}
              </Warning>
            </Pane>
          </Splitpanes>
        </Pane>
        <Pane :min-size="minPaneSize">
          <Splitpanes class="default-theme" horizontal>
            <Pane :min-size="minPaneSize" class="relative text-sm">
              <PaneTitle>Formula Input</PaneTitle>
              <div class="pa-4 flex size-full flex-col gap-4 overflow-y-auto">
                <div class="mt-2 flex flex-col gap-2">
                  <label for="formulaInput" class="select-none">Input</label>
                  <input
                    id="formulaInput"
                    v-model="formulaInput"
                    data-testid="formula-input"
                    name="formulaInput"
                    class="border-1 rounded border-stone-900 bg-white px-2 py-1 font-sans"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <span class="select-none">Formula</span>
                  <code
                    data-testid="formula-output"
                    class="border-1 flex items-center border-current px-2 py-1"
                  >
                    <span class="flex-1 overflow-x-auto text-stone-500">
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
            <Pane :min-size="minPaneSize" class="relative text-stone-500">
              <PaneTitle class="!text-stone-100"> Formula Tree </PaneTitle>
              <div class="flex size-full overflow-auto bg-stone-400">
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
            <Pane :min-size="minPaneSize" class="relative text-stone-500">
              <PaneTitle class="!text-stone-100"> Model Checker </PaneTitle>
              <div class="flex size-full overflow-auto bg-stone-400">
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
                  <Error v-else-if="!formula" class="rounded"> Formula is invalid. </Error>
                </div>
              </div>
            </Pane>
          </Splitpanes>
        </Pane>
      </Splitpanes>
    </main>
  </div>
</template>
