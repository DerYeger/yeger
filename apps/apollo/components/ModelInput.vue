<script setup lang="ts">
import { StreamLanguage } from '@codemirror/language'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { Codemirror } from 'vue-codemirror'

import { jsonToModel, yamlToJson } from '~~/util/yamlToModel'

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
})

const emit = defineEmits(['change'])

const { disabled } = toRefs(props)

const language = StreamLanguage.define(yaml)

const { modelInput } = useDemoData()
const input = ref(modelInput)

const error = ref<string>()

watch(
  input,
  (newValue, oldValue) => {
    if (newValue === oldValue) {
      return
    }
    const newResult = yamlToJson(newValue)
    const oldResult = oldValue ? yamlToJson(oldValue) : undefined

    if (newResult.isError) {
      error.value = newResult.getError()
      return
    }

    if (
      newResult.isOk &&
      JSON.stringify(newResult.get()) ===
        JSON.stringify(oldResult?.getOrUndefined())
    ) {
      return
    }

    const result = jsonToModel(newResult.get())
    if (result.isError) {
      error.value = result.getError()
    } else {
      error.value = undefined
      emit('change', result.get())
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="h-full w-full relative">
    <Codemirror
      v-model="input"
      :extensions="[language]"
      :style="{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        color: '#333',
      }"
      :disabled="disabled"
    />
    <div class="absolute top-2 right-2 flex gap-2 items-center h-fit">
      <Icon v-if="error" name="mdi:alert-circle" class="text-red-500" />
      <CopyButton :content="input" />
    </div>
    <Status v-if="error" class="absolute left-0 bottom-0 right-0 border-t-1">
      <code class="text-red-500">{{ error }}</code>
    </Status>
  </div>
</template>

<style scoped>
:deep(.cm-lineNumbers) {
  user-select: none;
}
</style>
