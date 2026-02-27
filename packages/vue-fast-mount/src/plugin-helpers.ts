const FAST_MOUNT_QUERY_KEY = '__vfm'
const FAST_MOUNT_QUERY_VALUE = '1'
const FAST_MOUNT_KEEP_QUERY_KEY = '__vfm_keep'

function isFastMountRuntimeImportSource(source: string): boolean {
  return source === 'vue-fast-mount'
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function appendFastMountQuery(specifier: string, keepBindings: string[] = []): string {
  if (!specifier.includes('.vue')) {
    return specifier
  }

  const hashIndex = specifier.indexOf('#')
  const hash = hashIndex === -1 ? '' : specifier.slice(hashIndex)
  const base = hashIndex === -1 ? specifier : specifier.slice(0, hashIndex)

  if (new RegExp(`(?:\\?|&)${FAST_MOUNT_QUERY_KEY}=`).test(base)) {
    return specifier
  }

  const separator = base.includes('?') ? '&' : '?'
  const keepQuery = keepBindings.length
    ? `&${FAST_MOUNT_KEEP_QUERY_KEY}=${encodeURIComponent(keepBindings.join(','))}`
    : ''

  return `${base}${separator}${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}${keepQuery}${hash}`
}

function findMatchingBracket(value: string, start: number, open: string, close: string): number {
  let depth = 0

  for (let index = start; index < value.length; index += 1) {
    const character = value[index]

    if (character === open) {
      depth += 1
      continue
    }

    if (character === close) {
      depth -= 1

      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

function extractExplicitlyUnstubbedComponents(callExpression: string): string[] {
  const stubsMatch = /\bstubs\s*:/.exec(callExpression)

  if (!stubsMatch) {
    return []
  }

  const stubsObjectStart = callExpression.indexOf('{', stubsMatch.index)

  if (stubsObjectStart === -1) {
    return []
  }

  const stubsObjectEnd = findMatchingBracket(callExpression, stubsObjectStart, '{', '}')

  if (stubsObjectEnd === -1) {
    return []
  }

  const stubsObject = callExpression.slice(stubsObjectStart + 1, stubsObjectEnd)
  const keepBindings = new Set<string>()

  const literalFalseMatcher =
    /(?:^|,)\s*(?:['"]([A-Za-z_$][\w$-]*)['"]|([A-Za-z_$][\w$]*))\s*:\s*false\b/g

  for (const match of stubsObject.matchAll(literalFalseMatcher)) {
    const componentName = match[1] ?? match[2]

    if (componentName) {
      keepBindings.add(componentName)
    }
  }

  return [...keepBindings]
}

function getCallExpression(code: string, callStart: number): string | null {
  const openParenthesis = code.indexOf('(', callStart)

  if (openParenthesis === -1) {
    return null
  }

  const closeParenthesis = findMatchingBracket(code, openParenthesis, '(', ')')

  if (closeParenthesis === -1) {
    return null
  }

  return code.slice(callStart, closeParenthesis + 1)
}

function parseFastMountAliases(code: string): string[] {
  const aliases = new Set<string>()
  const importMatcher = /import\s*{([^}]*)}\s*from\s*['"]([^'"]+)['"]/g

  for (const match of code.matchAll(importMatcher)) {
    const source = match[2]

    if (!source || !isFastMountRuntimeImportSource(source)) {
      continue
    }

    const specifiers = match[1]?.split(',') ?? []

    for (const specifier of specifiers) {
      const trimmedSpecifier = specifier.trim()

      if (!trimmedSpecifier) {
        continue
      }

      const aliasMatch = /^fastMount(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(trimmedSpecifier)

      if (!aliasMatch) {
        continue
      }

      aliases.add(aliasMatch[1] ?? 'fastMount')
    }
  }

  return [...aliases]
}

export function rewriteFastMountCallsites(code: string): string {
  const aliases = parseFastMountAliases(code)

  if (!aliases.length) {
    return code
  }

  let transformedCode = code

  for (const alias of aliases) {
    const escapedAlias = escapeForRegExp(alias)
    const pattern = new RegExp(
      `(^|[^\\w$.])(${escapedAlias})\\s*\\(\\s*import\\s*\\(\\s*(["'])([^"']+)\\3\\s*\\)`,
      'gm',
    )

    transformedCode = transformedCode.replace(
      pattern,
      (
        match,
        prefix: string,
        name: string,
        quote: string,
        specifier: string,
        offset: number,
        fullCode: string,
      ) => {
        const aliasStart = offset + prefix.length
        const callExpression = getCallExpression(fullCode, aliasStart)
        const keepBindings = callExpression
          ? extractExplicitlyUnstubbedComponents(callExpression)
          : []
        const rewrittenSpecifier = appendFastMountQuery(specifier, keepBindings)

        if (rewrittenSpecifier === specifier) {
          return match
        }

        return `${prefix}${name}(import(${quote}${rewrittenSpecifier}${quote})`
      },
    )
  }

  return transformedCode
}

function toPascalCase(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
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

function getComponentBindingName(tagName: string): string {
  const firstCharacter = tagName.charAt(0)

  if (firstCharacter && firstCharacter === firstCharacter.toUpperCase()) {
    return tagName
  }

  if (tagName.includes('-')) {
    return toPascalCase(tagName)
  }

  return ''
}

function collectPropsAndEmitsFromAttributes(attributes: string): ComponentTemplateUsage {
  const props = new Set<string>()
  const emits = new Set<string>()

  const attributeMatcher =
    /(?:@|:)[A-Za-z_$][\w$:-]*|v-bind:[A-Za-z_$][\w$-]*|v-on:[A-Za-z_$][\w$:-]*|v-model(?::[A-Za-z_$][\w$-]*)?|[A-Za-z][\w-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g

  for (const match of attributes.matchAll(attributeMatcher)) {
    const token = match[0]?.trim()

    if (!token) {
      continue
    }

    const key = token.split('=')[0]?.trim() ?? ''

    if (!key) {
      continue
    }

    if (key.startsWith('v-model')) {
      const argument = key.slice('v-model'.length)
      const modelName = argument.startsWith(':') ? toCamelCase(argument.slice(1)) : 'modelValue'
      props.add(modelName)
      emits.add(`update:${modelName}`)
      continue
    }

    if (key.startsWith('@') || key.startsWith('v-on:')) {
      const eventName = key.startsWith('@') ? key.slice(1) : key.slice('v-on:'.length)

      if (eventName) {
        emits.add(eventName)
      }
      continue
    }

    if (key.startsWith(':')) {
      props.add(toCamelCase(key.slice(1)))
      continue
    }

    if (key.startsWith('v-bind:')) {
      props.add(toCamelCase(key.slice('v-bind:'.length)))
      continue
    }

    if (key.startsWith('v-')) {
      continue
    }

    if (['class', 'style', 'key', 'ref', 'slot', 'is'].includes(key)) {
      continue
    }

    if (key.startsWith('data-') || key.startsWith('aria-')) {
      continue
    }

    props.add(toCamelCase(key))
  }

  return { props, emits }
}

function getTemplateComponentBindings(code: string): TemplateComponentUsage {
  const templateMatch = /<template\b[^>]*>([\s\S]*?)<\/template>/.exec(code)

  if (!templateMatch) {
    return {
      bindings: new Set<string>(),
      usageByBinding: new Map<string, ComponentTemplateUsage>(),
    }
  }

  const templateContent = templateMatch[1] ?? ''

  const bindings = new Set<string>()
  const usageByBinding = new Map<string, ComponentTemplateUsage>()
  const tagMatcher = /<\/?([A-Za-z][\w-]*)\b/g
  const openingTagMatcher = /<([A-Za-z][\w-]*)\b([^>]*)>/g

  for (const tagMatch of templateContent.matchAll(tagMatcher)) {
    const tagName = tagMatch[1]

    if (!tagName) {
      continue
    }

    const bindingName = getComponentBindingName(tagName)

    if (bindingName) {
      bindings.add(bindingName)
    }
  }

  for (const openingTagMatch of templateContent.matchAll(openingTagMatcher)) {
    const tagName = openingTagMatch[1]
    const attributes = openingTagMatch[2] ?? ''

    if (!tagName) {
      continue
    }

    const bindingName = getComponentBindingName(tagName)

    if (!bindingName || !bindings.has(bindingName)) {
      continue
    }

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
  }

  return { bindings, usageByBinding }
}

type ImportClauseSpec =
  | { kind: 'default'; local: string }
  | { kind: 'namespace'; local: string }
  | { kind: 'named'; imported: string; local: string }

function parseNamedSpecifiers(clause: string): Array<{ imported: string; local: string }> | null {
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

  const entries = content
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
  const specifiers: Array<{ imported: string; local: string }> = []

  for (const entry of entries) {
    const aliasMatch = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(entry)

    if (!aliasMatch) {
      return null
    }

    specifiers.push({
      imported: aliasMatch[1]!,
      local: aliasMatch[2] ?? aliasMatch[1]!,
    })
  }

  return specifiers
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

function parseImportClause(clause: string): ImportClauseSpec[] | null {
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

    return specs
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

function stringifyImportClause(specifiers: ImportClauseSpec[]): string {
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
      .map((specifier) =>
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

function createPlaceholderComponentDeclarations(
  locals: string[],
  usageByBinding: Map<string, ComponentTemplateUsage>,
): string {
  if (!locals.length) {
    return ''
  }

  return locals
    .map((local) => {
      const usage = usageByBinding.get(local)
      const props = usage ? [...usage.props].sort() : []
      const emits = usage ? [...usage.emits].sort() : []
      const propsPart = props.length ? `\n  props: ${JSON.stringify(props)},` : ''
      const emitsPart = emits.length ? `\n  emits: ${JSON.stringify(emits)},` : ''
      const stubTag = `${toKebabCase(local)}-stub`

      return `const ${local} = {\n  name: '${local}',${propsPart}${emitsPart}\n  render() {\n    const normalizedAttrs = Object.fromEntries(Object.entries(this.$attrs).map(([key, value]) => [key.replace(/[A-Z]/g, (character) => '-' + character.toLowerCase()), value]))\n    return h('${stubTag}', { ...normalizedAttrs, ...this.$props })\n  }\n}`
    })
    .join('\n\n')
}

function ensureVueHImport(script: string): string {
  if (/import\s*{[^}]*\bh\b[^}]*}\s*from\s*['"]vue['"]/.test(script)) {
    return script
  }

  return `\nimport { h } from 'vue'${script}`
}

function collectTopLevelImportStatements(script: string): ImportStatement[] {
  const statements: ImportStatement[] = []
  const lines = script.split('\n')
  const lineOffsets: number[] = []
  let offset = 0
  let isInsideBlockComment = false

  for (const line of lines) {
    lineOffsets.push(offset)
    offset += line.length + 1
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

function pruneTemplateOnlyImportsInScriptSetup(
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

  const replacements: Array<{ start: number; end: number; value: string }> = []
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

  const placeholderDeclarations = createPlaceholderComponentDeclarations(
    [...allRemovableLocals],
    usageByBinding,
  )

  if (placeholderDeclarations) {
    transformedScript = ensureVueHImport(transformedScript)
    transformedScript += `\n${placeholderDeclarations}`
  }

  return transformedScript
}

export function transformFastMountVueSource(code: string, keepBindings: Set<string>): string {
  const scriptMatcher = /<script\b([^>]*)>([\s\S]*?)<\/script>/g
  let scriptMatch: RegExpExecArray | null = null

  for (const currentMatch of code.matchAll(scriptMatcher)) {
    if (currentMatch[1]?.includes('setup')) {
      scriptMatch = currentMatch
      break
    }
  }

  if (!scriptMatch || !scriptMatch[2]) {
    return code
  }

  const { bindings: templateBindings, usageByBinding } = getTemplateComponentBindings(code)

  if (!templateBindings.size) {
    return code
  }

  const originalScript = scriptMatch[2]
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
  const scriptContentStart = (scriptMatch.index ?? 0) + fullMatch.indexOf(originalScript)
  const scriptContentEnd = scriptContentStart + originalScript.length

  return `${code.slice(0, scriptContentStart)}${transformedScript}${code.slice(scriptContentEnd)}`
}

export function shouldTransformVueFastMountId(id: string): boolean {
  if (!id.includes('.vue') || !id.includes('?')) {
    return false
  }

  const query = id.slice(id.indexOf('?') + 1)

  if (!new RegExp(`(?:^|&)${FAST_MOUNT_QUERY_KEY}=${FAST_MOUNT_QUERY_VALUE}(?:&|$)`).test(query)) {
    return false
  }

  return !/(?:^|&)type=/.test(query)
}

export function getKeepBindingsFromId(id: string): Set<string> {
  const queryStart = id.indexOf('?')

  if (queryStart === -1) {
    return new Set<string>()
  }

  const params = new URLSearchParams(id.slice(queryStart + 1))
  const keep = params.get(FAST_MOUNT_KEEP_QUERY_KEY)

  if (!keep) {
    return new Set<string>()
  }

  return new Set(
    keep
      .split(',')
      .map((binding) => binding.trim())
      .filter(Boolean),
  )
}

export const internalPluginHelpers = {
  collectTopLevelImportStatements,
  createPlaceholderComponentDeclarations,
  ensureVueHImport,
  parseImportClause,
  parseNamedSpecifiers,
  pruneTemplateOnlyImportsInScriptSetup,
  stringifyImportClause,
}
