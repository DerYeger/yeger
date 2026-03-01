import { NodeTypes } from '@vue/compiler-dom'
import { compileTemplate, type SFCTemplateBlock } from 'vue/compiler-sfc'

import type { Components, ComponentMetadata, PropType } from './utils'

export function analyzeTemplate(
  id: string,
  template: SFCTemplateBlock,
  unstubbedComponents: Set<string>,
): Components {
  const components: Components = new Map()

  function requireMetadata(tag: string): ComponentMetadata {
    const existing = components.get(tag)
    if (existing) {
      return existing
    }
    const newMetadata: ComponentMetadata = {
      props: new Map(),
      emits: new Set(),
    }
    components.set(tag, newMetadata)
    return newMetadata
  }

  compileTemplate({
    source: template.content,
    filename: id,
    id,
    compilerOptions: {
      nodeTransforms: [
        (node) => {
          if (node.type !== NodeTypes.ELEMENT) {
            return
          }

          const tag = node.tag
          if (!isComponent(tag) || unstubbedComponents.has(tag)) {
            return
          }

          const metadata = requireMetadata(tag)

          function onProp(name: string, type: PropType) {
            if (type === 'unknown' && metadata.props.has(name)) {
              // Do not widen type
              return
            }
            metadata.props.set(name, type)
          }

          function onEmit(name: string) {
            metadata.emits.add(name)
          }

          for (const prop of node.props) {
            if (prop.type === NodeTypes.ATTRIBUTE) {
              // Static attribute, e.g. <MyComponent disabled> or <MyComponent title="Hello">
              onProp(prop.name, prop.value === undefined ? 'boolean' : 'unknown')
            } else if (
              prop.type === NodeTypes.DIRECTIVE &&
              prop.name === 'bind' &&
              prop.arg?.type === NodeTypes.SIMPLE_EXPRESSION
            ) {
              // Dynamic binding, e.g. <MyComponent :disabled="isDisabled"> or <MyComponent :title="dynamicTitle">
              onProp(prop.arg.content, 'unknown')
            } else if (prop.type === NodeTypes.DIRECTIVE && prop.name === 'model') {
              // v-model, e.g. <MyComponent v-model="modelValue"> or <MyComponent v-model:named="namedModel">
              if (prop.arg?.type === NodeTypes.SIMPLE_EXPRESSION) {
                // Named model
                const modelName = prop.arg.content
                onProp(modelName, 'unknown')
                onEmit(`update:${modelName}`)
              } else {
                // Unnamed model
                onProp('modelValue', 'unknown')
                onEmit('update:modelValue')
              }
            } else if (
              prop.type === NodeTypes.DIRECTIVE &&
              prop.name === 'on' &&
              prop.arg?.type === NodeTypes.SIMPLE_EXPRESSION
            ) {
              // Event listener, e.g. <MyComponent @click="handleClick">
              onEmit(prop.arg.content)
            }
          }
        },
      ],
    },
  })

  return components
}

function isComponent(tag: string): boolean {
  return !!tag[0] && tag[0] === tag[0].toUpperCase()
}
