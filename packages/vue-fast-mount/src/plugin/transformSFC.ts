import * as s from '@yeger/streams/sync'

import { escapeForRegExp } from './shared'

function toPascalCase(value: string): string {
  return s.join(
    s.pipe(
      value.split('-'),
      s.filterTruthy(),
      s.map((part) => part.charAt(0).toUpperCase() + part.slice(1)),
    ),
    '',
  )
}

function toCamelCase(value: string): string {
  return value.replace(/-([a-zA-Z])/g, (_, character: string) => character.toUpperCase())
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

type ComponentTemplateUsage = {
  props: Set<string>
  emits: Set<string>
}

type TemplateComponentUsage = {
  bindings: Set<string>
  usageByBinding: Map<string, ComponentTemplateUsage>
}

function getComponentBindingName(tagName: string): string | undefined {
  const firstCharacter = tagName.charAt(0)
  if (firstCharacter && firstCharacter === firstCharacter.toUpperCase()) {
    return tagName
  }

  if (tagName.includes('-')) {
    return toPascalCase(tagName)
  }

  return undefined
}

function collectPropsAndEmitsFromAttributes(attributes: string): ComponentTemplateUsage {
  const props = new Set<string>()
  const emits = new Set<string>()

  const attributeMatcher =
    /(?:@|:)[A-Za-z_$][\w$:-]*|v-bind:[A-Za-z_$][\w$-]*|v-on:[A-Za-z_$][\w$:-]*|v-model(?::[A-Za-z_$][\w$-]*)?|[A-Za-z][\w-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g

  s.forEach(
    s.pipe(
      attributes.matchAll(attributeMatcher),
      s.map((match) => match[0]?.trim()),
      s.map((token) => token?.split('=')[0]?.trim()),
      s.filterTruthy(),
    ),
    (key) => {
      if (key.startsWith('v-model')) {
        const argument = key.slice('v-model'.length)
        const modelName = argument.startsWith(':') ? toCamelCase(argument.slice(1)) : 'modelValue'
        props.add(modelName)
        emits.add(`update:${modelName}`)
      } else if (key.startsWith('@') || key.startsWith('v-on:')) {
        const eventName = key.startsWith('@') ? key.slice(1) : key.slice('v-on:'.length)
        if (eventName) {
          emits.add(eventName)
        }
      } else if (key.startsWith(':')) {
        props.add(toCamelCase(key.slice(1)))
      } else if (key.startsWith('v-bind:')) {
        props.add(toCamelCase(key.slice('v-bind:'.length)))
      } else if (
        !key.startsWith('v-') &&
        !['class', 'style', 'key', 'ref', 'slot', 'is'].includes(key) &&
        !key.startsWith('data-') &&
        !key.startsWith('aria-')
      ) {
        props.add(toCamelCase(key))
      }
    },
  )

  return { props, emits }
}

function isBuiltInElement(tagName: string): boolean {
  return [
    'Slot',
    'Template',
    'Component',
    'Teleport',
    'Transition',
    'TransitionGroup',
    'KeepAlive',
    'Suspense',
  ].includes(tagName)
}

function getTemplateComponentBindings(code: string): TemplateComponentUsage {
  // Find the opening <template tag
  const templateOpenMatch = /<template\b[^>]*>/i.exec(code)

  if (!templateOpenMatch) {
    return {
      bindings: new Set<string>(),
      usageByBinding: new Map<string, ComponentTemplateUsage>(),
    }
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
    return {
      bindings: new Set<string>(),
      usageByBinding: new Map<string, ComponentTemplateUsage>(),
    }
  }

  const templateContent = code.slice(startIndex, templateEndIndex)

  const usageByBinding = new Map<string, ComponentTemplateUsage>()
  const tagMatcher = /<\/?([A-Za-z][\w-]*)\b/g
  const openingTagMatcher = /<([A-Za-z][\w-]*)\b([^>]*)>/g

  const bindings = s.toSet(
    s.pipe(
      templateContent.matchAll(tagMatcher),
      s.map((tagMatch) => tagMatch[1]),
      s.filterTruthy(),
      s.map((tagName) => getComponentBindingName(tagName)),
      s.filterTruthy(),
      s.filter((bindingName) => !isBuiltInElement(bindingName)),
    ),
  )

  s.forEach(
    s.pipe(
      templateContent.matchAll(openingTagMatcher),
      s.map((openingTagMatch: RegExpExecArray) => ({
        tagName: openingTagMatch[1],
        attributes: openingTagMatch[2] ?? '',
      })),
      s.filter((item): item is { tagName: string; attributes: string } => Boolean(item.tagName)),
      s.map((item) => ({
        tagName: item.tagName,
        attributes: item.attributes,
        bindingName: getComponentBindingName(item.tagName) ?? '',
      })),
      s.filter((item) =>
        Boolean(
          item.bindingName && !isBuiltInElement(item.bindingName) && bindings.has(item.bindingName),
        ),
      ),
    ),
    (item) => {
      const { bindingName, attributes } = item
      const existingUsage = usageByBinding.get(bindingName) ?? {
        props: new Set<string>(),
        emits: new Set<string>(),
      }
      const extractedUsage = collectPropsAndEmitsFromAttributes(attributes)

      for (const prop of extractedUsage.props) {
        existingUsage.props.add(prop)
      }

      for (const emittedEvent of extractedUsage.emits) {
        existingUsage.emits.add(emittedEvent)
      }

      usageByBinding.set(bindingName, existingUsage)
    },
  )

  return { bindings, usageByBinding }
}

type ImportClauseSpec =
  | { kind: 'default'; local: string }
  | { kind: 'namespace'; local: string }
  | { kind: 'named'; imported: string; local: string }

export function parseNamedSpecifiers(
  clause: string,
): Array<{ imported: string; local: string }> | null {
  const trimmedClause = clause.trim()

  if (!trimmedClause.startsWith('{') || !trimmedClause.endsWith('}')) {
    return null
  }

  const content = trimmedClause.slice(1, -1).trim()
  if (!content) {
    return []
  }

  if (/\btype\b/.test(content)) {
    return null
  }

  const specifiers = s.toArray(
    s.pipe(
      content.split(','),
      s.map((entry) => entry.trim()),
      s.filterTruthy(),
      s.map((entry) => /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(entry)),
      s.filterDefined(),
    ),
  )
  if (specifiers.length === 0) {
    return null
  }

  return specifiers.map((match) => {
    const aliasMatch = match!
    return {
      imported: aliasMatch[1]!,
      local: aliasMatch[2] ?? aliasMatch[1]!,
    }
  })
}

function splitImportClause(clause: string): [string, string | undefined] {
  let depth = 0

  for (let index = 0; index < clause.length; index += 1) {
    const character = clause[index]

    if (character === '{') {
      depth += 1
      continue
    }

    if (character === '}') {
      depth = Math.max(0, depth - 1)
      continue
    }

    if (character === ',' && depth === 0) {
      return [clause.slice(0, index).trim(), clause.slice(index + 1).trim()]
    }
  }

  return [clause.trim(), undefined]
}

export function parseImportClause(clause: string): ImportClauseSpec[] | null {
  const [head, tail] = splitImportClause(clause)
  const specs: ImportClauseSpec[] = []

  if (head.startsWith('{')) {
    const named = parseNamedSpecifiers(head)

    if (!named) {
      return null
    }

    for (const specifier of named) {
      specs.push({ kind: 'named', imported: specifier.imported, local: specifier.local })
    }

    return named.map((specifier) => ({
      kind: 'named',
      imported: specifier.imported,
      local: specifier.local,
    }))
  }

  if (head.startsWith('*')) {
    const namespaceMatch = /^\*\s+as\s+([A-Za-z_$][\w$]*)$/.exec(head)

    if (!namespaceMatch || tail) {
      return null
    }

    specs.push({ kind: 'namespace', local: namespaceMatch[1]! })
    return specs
  }

  if (!/^[A-Za-z_$][\w$]*$/.test(head)) {
    return null
  }

  specs.push({ kind: 'default', local: head })

  if (!tail) {
    return specs
  }

  if (tail.startsWith('{')) {
    const named = parseNamedSpecifiers(tail)

    if (!named) {
      return null
    }

    for (const specifier of named) {
      specs.push({ kind: 'named', imported: specifier.imported, local: specifier.local })
    }

    return specs
  }

  const namespaceMatch = /^\*\s+as\s+([A-Za-z_$][\w$]*)$/.exec(tail)

  if (!namespaceMatch) {
    return null
  }

  specs.push({ kind: 'namespace', local: namespaceMatch[1]! })
  return specs
}

export function stringifyImportClause(specifiers: ImportClauseSpec[]): string {
  const defaultSpecifier = specifiers.find((specifier) => specifier.kind === 'default')
  const namespaceSpecifier = specifiers.find((specifier) => specifier.kind === 'namespace')
  const namedSpecifiers = specifiers.filter(
    (specifier): specifier is Extract<ImportClauseSpec, { kind: 'named' }> =>
      specifier.kind === 'named',
  )
  const clauseParts: string[] = []

  if (defaultSpecifier?.kind === 'default') {
    clauseParts.push(defaultSpecifier.local)
  }

  if (namespaceSpecifier?.kind === 'namespace') {
    clauseParts.push(`* as ${namespaceSpecifier.local}`)
  }

  if (namedSpecifiers.length) {
    const namedClause = namedSpecifiers
      .map((specifier: Extract<ImportClauseSpec, { kind: 'named' }>) =>
        specifier.imported === specifier.local
          ? specifier.imported
          : `${specifier.imported} as ${specifier.local}`,
      )
      .join(', ')

    clauseParts.push(`{ ${namedClause} }`)
  }

  return clauseParts.join(', ')
}

type ImportStatement = {
  statement: string
  start: number
  end: number
}

export function createStubDeclarations(
  componentNames: Set<string>,
  usageByBinding: Map<string, ComponentTemplateUsage>,
): string | undefined {
  if (!componentNames.size) {
    return undefined
  }
  return s.join(
    s.pipe(
      componentNames,
      s.map((componentName) => {
        const usage = usageByBinding.get(componentName)
        const props = usage ? [...usage.props].sort() : []
        const emits = usage ? [...usage.emits].sort() : []
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
                s.map((emitted) => `'${emitted}'`),
              ),
              ', ',
            )}],`
          : ''
        const stubTag = `${toKebabCase(componentName)}-stub`

        return `const ${componentName} = {
  name: '${componentName}',${propsPart}${emitsPart}
  render() {
    const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))
    return h('${stubTag}', { ...normalizedAttrs, ...this.$props })
  }
}`
      }),
    ),
    '\n\n',
  )
}

export function ensureVueHImport(script: string): string {
  if (/import\s*{[^}]*\bh\b[^}]*}\s*from\s*['"]vue['"]/.test(script)) {
    return script
  }

  return `import { h } from 'vue'\n${script}`
}

export function collectTopLevelImportStatements(script: string): ImportStatement[] {
  const statements: ImportStatement[] = []
  const lines = script.split('\n')
  const lineOffsets: number[] = []
  let isInsideBlockComment = false

  let currentOffset = 0
  for (const line of lines) {
    lineOffsets.push(currentOffset)
    currentOffset += line.length + 1
  }

  let lineIndex = 0

  while (lineIndex < lines.length) {
    const line = lines[lineIndex] ?? ''
    const trimmedLine = line.trim()

    if (isInsideBlockComment) {
      if (trimmedLine.includes('*/')) {
        isInsideBlockComment = false
      }

      lineIndex += 1
      continue
    }

    if (!trimmedLine) {
      lineIndex += 1
      continue
    }

    if (trimmedLine.startsWith('//')) {
      lineIndex += 1
      continue
    }

    if (trimmedLine.startsWith('/*')) {
      if (!trimmedLine.includes('*/')) {
        isInsideBlockComment = true
      }

      lineIndex += 1
      continue
    }

    if (!trimmedLine.startsWith('import')) {
      break
    }

    const startLine = lineIndex
    let statement = line
    lineIndex += 1

    while (lineIndex < lines.length) {
      const normalized = statement
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/[^\n]*/g, '')
        .trim()

      if (
        /^import\s+type\s+.+\s+from\s+['"][^'"]+['"]\s*;?$/.test(normalized) ||
        /^import\s+.+\s+from\s+['"][^'"]+['"]\s*;?$/.test(normalized) ||
        /^import\s+['"][^'"]+['"]\s*;?$/.test(normalized)
      ) {
        break
      }

      statement += `\n${lines[lineIndex] ?? ''}`
      lineIndex += 1
    }

    const start = lineOffsets[startLine]

    if (start === undefined) {
      continue
    }

    const end = start + statement.length
    statements.push({ statement, start, end })
  }

  return statements
}

export function pruneTemplateOnlyImportsInScriptSetup(
  script: string,
  templateBindings: Set<string>,
  usageByBinding: Map<string, ComponentTemplateUsage>,
  keepBindings: Set<string>,
): string {
  if (!templateBindings.size) {
    return script
  }

  const importStatements = collectTopLevelImportStatements(script)

  if (!importStatements.length) {
    return script
  }

  let scriptWithoutImports = script

  for (const importStatement of [...importStatements].reverse()) {
    scriptWithoutImports = `${scriptWithoutImports.slice(0, importStatement.start)}${' '.repeat(importStatement.end - importStatement.start)}${scriptWithoutImports.slice(importStatement.end)}`
  }

  const replacements: { start: number; end: number; value: string }[] = []
  const allRemovableLocals = new Set<string>()

  for (const importStatement of importStatements) {
    const normalizedStatement = importStatement.statement.trim()

    if (normalizedStatement.startsWith('import type ')) {
      continue
    }

    if (/^import\s+['"][^'"]+['"]\s*;?$/.test(normalizedStatement)) {
      continue
    }

    const importClauseMatch = /^import\s+([\s\S]+?)\s+from\s+['"][^'"]+['"]\s*;?$/.exec(
      normalizedStatement,
    )

    if (!importClauseMatch) {
      continue
    }

    const importClause = importClauseMatch[1]

    if (!importClause) {
      continue
    }

    const parsedClause = parseImportClause(importClause)

    if (!parsedClause) {
      continue
    }

    const removableLocals = new Set<string>()

    for (const specifier of parsedClause) {
      const localName = specifier.local

      if (keepBindings.has(localName)) {
        continue
      }

      if (!templateBindings.has(localName)) {
        continue
      }

      if (new RegExp(`\\b${escapeForRegExp(localName)}\\b`).test(scriptWithoutImports)) {
        continue
      }

      removableLocals.add(localName)
    }

    if (!removableLocals.size) {
      continue
    }

    for (const local of removableLocals) {
      allRemovableLocals.add(local)
    }

    const keptSpecifiers = parsedClause.filter((specifier) => !removableLocals.has(specifier.local))

    if (!keptSpecifiers.length) {
      replacements.push({
        start: importStatement.start,
        end: importStatement.end,
        value: '',
      })
      continue
    }

    const importSourceMatch = /from\s+(['"][^'"]+['"])/.exec(normalizedStatement)

    if (!importSourceMatch) {
      continue
    }

    replacements.push({
      start: importStatement.start,
      end: importStatement.end,
      value: `import ${stringifyImportClause(keptSpecifiers)} from ${importSourceMatch[1]}`,
    })
  }

  if (!replacements.length) {
    return script
  }

  let transformedScript = script

  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    transformedScript = `${transformedScript.slice(0, replacement.start)}${replacement.value}${transformedScript.slice(replacement.end)}`
  }

  // Remove consecutive empty lines created by removed imports
  transformedScript = transformedScript.replace(/\n\s*\n\s*\n/g, '\n\n')

  const stubDeclarations = createStubDeclarations(allRemovableLocals, usageByBinding)
  if (!stubDeclarations) {
    return transformedScript
  }

  return `\n${ensureVueHImport(transformedScript)}\n${stubDeclarations}\n`
}

export function transformSFC(code: string, keepBindings: Set<string>): string {
  const scriptMatcher = /<script\b([^>]*)>([\s\S]*?)<\/script>/g
  const scriptMatch = s.last(
    s.pipe(
      code.matchAll(scriptMatcher),
      s.filter((currentMatch) => currentMatch[1]?.includes('setup') ?? false),
    ),
  )
  if (!scriptMatch) {
    return code
  }

  const originalScript = scriptMatch[2]
  if (!originalScript) {
    return code
  }

  const { bindings: templateBindings, usageByBinding } = getTemplateComponentBindings(code)

  if (!templateBindings.size) {
    return code
  }

  const transformedScript = pruneTemplateOnlyImportsInScriptSetup(
    originalScript,
    templateBindings,
    usageByBinding,
    keepBindings,
  )

  if (transformedScript === originalScript) {
    return code
  }

  const fullMatch = scriptMatch[0]
  const scriptIndex = scriptMatch.index ?? 0
  const scriptContentStart = scriptIndex + fullMatch.indexOf(originalScript)
  const scriptContentEnd = scriptContentStart + originalScript.length

  return `${code.slice(0, scriptContentStart)}${transformedScript}${code.slice(scriptContentEnd)}`
}
