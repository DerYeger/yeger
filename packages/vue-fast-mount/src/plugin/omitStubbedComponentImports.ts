import * as s from '@yeger/streams/sync'

import { collectStaticImports } from './collectStaticImports'
import { createComponentStubs } from './createComponentStubs'
import { ensureVueHImport } from './ensureVHImport'
import type { Components } from './getComponentsFromTemplate'
import { escapeForRegExp } from './shared'

export function omitStubbedComponentImports(script: string, components: Components): string {
  if (!components.size) {
    return script
  }

  const importStatements = collectStaticImports(script)

  if (!importStatements.length) {
    return script
  }

  let scriptWithoutImports = script

  for (const importStatement of importStatements.toReversed()) {
    scriptWithoutImports = `${scriptWithoutImports.slice(0, importStatement.start)}${' '.repeat(importStatement.end - importStatement.start)}${scriptWithoutImports.slice(importStatement.end)}`
  }

  const replacements: { start: number; end: number; value: string }[] = []
  const allRemovableLocals = new Set<string>()

  for (const importStatement of importStatements) {
    const normalizedStatement = importStatement.statement.trim()
    const statementWithoutLeadingComments = normalizedStatement.replace(
      /^(?:\/\*[\s\S]*?\*\/\s*)+/,
      '',
    )
    const importSyntax = statementWithoutLeadingComments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '')
      .trim()

    if (!importSyntax.startsWith('import')) {
      continue
    }

    if (importSyntax.startsWith('import type ')) {
      continue
    }

    if (/^import\s+['"][^'"]+['"]\s*;?$/.test(importSyntax)) {
      continue
    }

    const importClauseMatch = /^import\s+([\s\S]+?)\s+from\s+['"][^'"]+['"]\s*;?$/.exec(
      importSyntax,
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

      if (!components.has(localName)) {
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

    const importSourceMatch = /from\s+(['"][^'"]+['"])/.exec(importSyntax)

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

  const stubDeclarations = createComponentStubs(components)
  if (!stubDeclarations) {
    return transformedScript
  }

  return `\n${ensureVueHImport(transformedScript)}\n${stubDeclarations}\n`
}

type ImportClauseSpec =
  | { kind: 'default'; local: string }
  | { kind: 'namespace'; local: string }
  | { kind: 'named'; imported: string; local: string }

export function parseNamedSpecifiers(clause: string): { imported: string; local: string }[] | null {
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
