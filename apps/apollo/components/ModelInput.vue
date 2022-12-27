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
  <Icon
    v-if="error"
    name="mdi:alert-circle"
    class="absolute top-2 right-2 text-red-500"
  />
</template>
