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
  const booleanShorthandProps = [...(data.booleanShorthandProps ?? new Set<string>())].sort()
  const booleanShorthandPropSet = new Set(booleanShorthandProps)
  const propsPart = props.length
    ? `\n  props: {${s.join(
        s.pipe(
          props,
          s.map(
            (prop) => `\n    '${prop}': ${booleanShorthandPropSet.has(prop) ? 'Boolean' : 'null'}`,
          ),
        ),
        ', ',
      )}\n  },`
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
  const normalizedPropsPart = `\n    const booleanShorthandProps = new Set([${s.join(
    s.pipe(
      booleanShorthandProps,
      s.map((prop) => `'${prop}'`),
    ),
    ', ',
  )}])
    const vnodeProps = ((this as { $?: { vnode?: { props?: Record<string, unknown> } } }).$?.vnode?.props ?? {}) as Record<string, unknown>
    const normalizedProps = Object.fromEntries(Object.entries(this.$props).map(([key, value]) => {
      const camelKey = key.replace(/-([a-zA-Z])/g, (_, character) => character.toUpperCase())
      const kebabKey = key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase())
      const hasShorthandMetadata = booleanShorthandProps.has(key) || booleanShorthandProps.has(camelKey)
      const hasEmptyVNodeProp = vnodeProps[key] === '' || vnodeProps[camelKey] === '' || vnodeProps[kebabKey] === ''
      const isShorthandBoolean = hasShorthandMetadata || hasEmptyVNodeProp
      return [key, value === '' && isShorthandBoolean ? true : value]
    }))`
  const stubTag = `${toKebabCase(componentName)}-stub`

  return `const ${componentIdentifier} = {
  name: '${componentIdentifier}',${propsPart}${emitsPart}
  render() {
    const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))
${normalizedPropsPart}
    return h('${stubTag}', { ...normalizedAttrs, ...normalizedProps })
  }
}`
}

function toComponentIdentifier(componentName: string): string {
  if (/^[A-Za-z_$][\w$]*$/.test(componentName)) {
    return componentName
  }

  return toPascalCase(componentName)
}
