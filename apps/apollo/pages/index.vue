<script setup lang="ts">
import type { Model, ModelCheckerMode } from '@yeger/fol'
import { FOL } from '@yeger/fol'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const minPaneSize = 10

const formulaInput = ref('exists x. W(x,x) && f(b) = x')

const parseResult = computed(() => FOL.parse(formulaInput.value))
const formula = computed(() => parseResult.value.getOrUndefined())
const formulaError = computed(() => parseResult.value.getErrorOrUndefined())

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
</script>

<template>
  <main class="bg-stone-100 h-100vh !h-100dvh">
    <Splitpanes class="default-theme">
      <Pane :min-size="minPaneSize">
        <Splitpanes class="default-theme" horizontal>
          <Pane :min-size="minPaneSize" class="h-full w-full relative">
            <ModelInput @change="(newModel) => (model = newModel)" />
          </Pane>
          <Pane :min-size="minPaneSize" class="relative">
            <PaneTitle>Model Graph</PaneTitle>
            <ModelGraph v-if="model" :model="model" />
          </Pane>
        </Splitpanes>
      </Pane>
      <Pane :min-size="minPaneSize">
        <Splitpanes class="default-theme" horizontal>
          <Pane :min-size="minPaneSize" class="relative">
            <PaneTitle>Formula Input</PaneTitle>
            <div class="h-full w-full flex flex-col gap-4 pa-4 overflow-y-auto">
              <div class="flex flex-col gap-2 mt-2">
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
                  >{{ formulaError ?? 'None' }}</pre
                >
              </div>
            </div>
          </Pane>
          <Pane :min-size="minPaneSize" class="text-stone-500 relative">
            <PaneTitle class="!text-stone-100">Formula Tree</PaneTitle>
            <div class="w-full h-full flex overflow-auto bg-stone-900 bg-op-25">
              <div v-if="formula" class="m-auto p-2">
                <FOLTree
                  :fragment="formula"
                  :level="0"
                  :max-depth="formula.depth()"
                />
              </div>
            </div>
          </Pane>
        </Splitpanes>
      </Pane>
      <Pane :min-size="minPaneSize">
        <Splitpanes class="default-theme" horizontal>
          <Pane :min-size="minPaneSize" class="relative">
            <PaneTitle>Evaluation Settings</PaneTitle>
            <div class="h-full w-full flex flex-col gap-4 pa-4 overflow-y-auto">
              <div class="flex flex-col gap-2 mt-2">
                <label>Eager Evaluation</label>
                <ToggleButton
                  :input="modelCheckerMode === 'eager'"
                  @update:input="onModeChange"
                />
              </div>
              <div class="flex flex-col gap-2">
                <span>Error</span>
                <pre
                  class="px-2 py-1 border-current border-1 text-stone-500 overflow-x-auto"
                  >{{ traceError ?? 'None' }}</pre
                >
              </div>
            </div>
          </Pane>
          <Pane :min-size="minPaneSize" class="text-stone-500 relative">
            <PaneTitle class="!text-stone-100">Evaluation</PaneTitle>
            <div class="w-full h-full flex overflow-auto bg-stone-900 bg-op-25">
              <div v-if="trace" class="m-auto p-2">
                <ModelCheckerTraceTree
                  :trace="trace"
                  :level="0"
                  :max-depth="trace.depth()"
                />
              </div>
            </div>
          </Pane>
        </Splitpanes>
      </Pane>
    </Splitpanes>
  </main>
</template>
