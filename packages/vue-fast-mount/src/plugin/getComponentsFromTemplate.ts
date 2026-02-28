import * as s from '@yeger/streams/sync'

import { toCamelCase } from './shared'

export type ComponentData = {
  props: Set<string>
  emits: Set<string>
}

export type Components = ReadonlyMap<string, ComponentData>

export function getComponentsFromTemplate(
  code: string,
  unstubbedComponents: Set<string>,
): Components {
  // Find the opening <template tag
  const templateOpenMatch = /<template\b[^>]*>/i.exec(code)
  if (!templateOpenMatch) {
    return new Map()
  }

  // Find the matching closing </template> by counting nesting
  const startIndex = templateOpenMatch.index + templateOpenMatch[0].length
  let depth = 1
  let index = startIndex
  let templateEndIndex = -1

  while (index < code.length && depth > 0) {
    const openMatch = /<template\b/i.exec(code.slice(index))
    const closeMatch = /<\/template\s*>/i.exec(code.slice(index))

    const openIndex = openMatch ? index + openMatch.index : Infinity
    const closeIndex = closeMatch ? index + closeMatch.index : Infinity

    if (closeIndex < openIndex) {
      depth--
      if (depth === 0) {
        templateEndIndex = closeIndex
        break
      }
      index = closeIndex + closeMatch![0].length
    } else if (openIndex < Infinity) {
      depth++
      index = openIndex + openMatch![0].length
    } else {
      break
    }
  }

  if (templateEndIndex === -1) {
    return new Map()
  }

  const templateContent = code.slice(startIndex, templateEndIndex)

  const openingTagMatcher = /<([A-Za-z][\w-]*)\b([^>]*)>/g

  const components = new Map<string, ComponentData>()

  s.forEach(
    s.pipe(
      templateContent.matchAll(openingTagMatcher),
      s.map((openingTagMatch) => {
        const [_, tagName, attributes = ''] = openingTagMatch
        if (!tagName) {
          return undefined
        }
        const componentName = getComponentName(tagName)
        if (!componentName) {
          return undefined
        }
        return {
          attributes,
          componentName,
        }
      }),
      s.filterDefined(),
      s.filter(
        (item) =>
          !isBuiltInElement(item.componentName) && !unstubbedComponents.has(item.componentName),
      ),
    ),
    ({ componentName, attributes }) => {
      const existingUsage = components.get(componentName) ?? {
        props: new Set<string>(),
        emits: new Set<string>(),
      }

      const extractedUsage = collectComponentData(attributes)
      for (const prop of extractedUsage.props) {
        existingUsage.props.add(prop)
      }
      for (const emittedEvent of extractedUsage.emits) {
        existingUsage.emits.add(emittedEvent)
      }

      components.set(componentName, existingUsage)
    },
  )

  return components
}

function getComponentName(tagName: string): string | undefined {
  const firstCharacter = tagName.charAt(0)
  if (firstCharacter && firstCharacter === firstCharacter.toUpperCase()) {
    return tagName
  }

  if (tagName.includes('-')) {
    return tagName
  }

  return undefined
}

function collectComponentData(attributes: string): ComponentData {
  const props = new Set<string>()
  const emits = new Set<string>()

  s.forEach(
    s.pipe(
      extractAttributeTokens(attributes),
      s.map((token) => getAttributeKey(token)),
      s.filterTruthy(),
    ),
    (key) => {
      if (key.startsWith('v-model')) {
        const argument = key.slice('v-model'.length).split('.')[0] ?? ''
        const modelName = argument.startsWith(':') ? toCamelCase(argument.slice(1)) : 'modelValue'
        props.add(modelName)
        emits.add(`update:${modelName}`)
      } else if (key.startsWith('@') || key.startsWith('v-on:')) {
        const rawEventName = key.startsWith('@') ? key.slice(1) : key.slice('v-on:'.length)
        const eventName = rawEventName.split('.')[0] ?? ''
        if (eventName) {
          emits.add(eventName)
        }
      } else if (key.startsWith(':')) {
        const propName = key.slice(1).split('.')[0] ?? ''
        if (propName && !isIgnoredProp(propName)) {
          props.add(propName)
        }
      } else if (key.startsWith('v-bind:')) {
        const propName = key.slice('v-bind:'.length).split('.')[0] ?? ''
        if (propName && !isIgnoredProp(propName)) {
          props.add(propName)
        }
      } else if (!key.startsWith('v-') && !isIgnoredProp(key)) {
        props.add(key)
      }
    },
  )

  return { props, emits }
}

function extractAttributeTokens(attributes: string): string[] {
  const tokens: string[] = []
  let token = ''
  let activeQuote: string | undefined

  for (const character of attributes) {
    if (activeQuote) {
      token += character
      if (character === activeQuote) {
        activeQuote = undefined
      }
      continue
    }

    if (character === '"' || character === "'" || character === '`') {
      activeQuote = character
      token += character
      continue
    }

    if (/\s/.test(character)) {
      if (token) {
        tokens.push(token)
        token = ''
      }
      continue
    }

    token += character
  }

  if (token) {
    tokens.push(token)
  }

  return tokens
}

function getAttributeKey(token: string): string | undefined {
  const trimmedToken = token.trim()
  if (!trimmedToken || trimmedToken === '/' || trimmedToken === '/>') {
    return undefined
  }

  const equalsIndex = trimmedToken.indexOf('=')
  const key = (equalsIndex === -1 ? trimmedToken : trimmedToken.slice(0, equalsIndex)).trim()
  if (!key) {
    return undefined
  }

  return key
}

const SPECIAL_ATTRIBUTES = new Set(['class', 'style', 'slot', 'is', 'ref', 'key'])

function isIgnoredProp(key: string): boolean {
  return SPECIAL_ATTRIBUTES.has(key) || key.startsWith('data-') || key.startsWith('aria-')
}

const BUILTIUN_ELEMENTS = new Set([
  'Slot',
  'Template',
  'Component',
  'component',
  'Teleport',
  'Transition',
  'TransitionGroup',
  'KeepAlive',
  'Suspense',
])

function isBuiltInElement(tagName: string): boolean {
  return BUILTIUN_ELEMENTS.has(tagName)
}
