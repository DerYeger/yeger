import {
  escapeForRegExp,
  FAST_MOUNT_KEEP_QUERY_KEY,
  FAST_MOUNT_QUERY_KEY,
  FAST_MOUNT_QUERY_VALUE,
} from './shared'

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

function isFastMountRuntimeImportSource(source: string): boolean {
  return source === 'vue-fast-mount'
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
