import * as s from '@yeger/streams/sync'

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

  s.forEach(
    s.pipe(
      aliases.map((alias) => ({
        alias,
        pattern: new RegExp(
          `(^|[^\\w$.])(${escapeForRegExp(alias)})\\s*\\(\\s*import\\s*\\(\\s*(["'])([^"']+)\\3\\s*\\)`,
          'gm',
        ),
      })),
    ),
    (item) => {
      transformedCode = transformedCode.replace(
        item.pattern,
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
    },
  )

  return transformedCode
}

const IMPORT_REGEX = /import\s*{([^}]*)}\s*from\s*['"]([^'"]+)['"]/g

function parseFastMountAliases(code: string): string[] {
  return s.toArray(
    s.pipe(
      code.matchAll(IMPORT_REGEX),
      s.flatMap((match) => {
        const source = match[2]
        if (!source || !isFastMountRuntimeImportSource(source)) {
          return []
        }
        return match[1]?.split(',') ?? []
      }),
      s.map((specifier) => specifier.trim()),
      s.filterTruthy(),
      s.map((trimmedSpecifier) =>
        /^fastMount(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(trimmedSpecifier),
      ),
      s.filterDefined(),
      s.map((match) => match[1] ?? 'fastMount'),
      s.distinct(),
    ),
  )
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

  const literalFalseMatcher =
    /(?:^|,)\s*(?:['"]([A-Za-z_$][\w$-]*)['"]|([A-Za-z_$][\w$]*))\s*:\s*false\b/g

  return s.toArray(
    s.pipe(
      stubsObject.matchAll(literalFalseMatcher),
      s.map((match) => match[1] ?? match[2]),
      s.filterDefined(),
      s.distinct(),
    ),
  )
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
