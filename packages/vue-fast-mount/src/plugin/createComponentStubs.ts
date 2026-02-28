import * as s from '@yeger/streams/sync'

import type { ComponentData, Components } from './getComponentsFromTemplate'
import { toKebabCase, toPascalCase } from './shared'

export function createComponentStubs(components: Components): string | undefined {
  if (!components.size) {
    return undefined
  }
  return s.join(
    s.pipe(
      components,
      s.map(([componentName, data]) => createComponentStub(componentName, data)),
    ),
    '\n\n',
  )
}

function createComponentStub(componentName: string, data: ComponentData): string {
  const componentIdentifier = toComponentIdentifier(componentName)
  const props = [...data.props].sort()
  const emits = [...data.emits].sort()
  const propsPart = props.length
    ? `\n  props: [${s.join(
        s.pipe(
          props,
          s.map((prop) => `'${prop}'`),
        ),
        ', ',
      )}],`
    : ''
  const emitsPart = emits.length
    ? `\n  emits: [${s.join(
        s.pipe(
          emits,
          s.map((emit) => `'${emit}'`),
        ),
        ', ',
      )}],`
    : ''
  const stubTag = `${toKebabCase(componentName)}-stub`

  return `const ${componentIdentifier} = {
  name: '${componentIdentifier}',${propsPart}${emitsPart}
  render() {
    const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))
    return h('${stubTag}', { ...normalizedAttrs, ...this.$props })
  }
}`
}

function toComponentIdentifier(componentName: string): string {
  if (/^[A-Za-z_$][\w$]*$/.test(componentName)) {
    return componentName
  }

  return toPascalCase(componentName)
}
