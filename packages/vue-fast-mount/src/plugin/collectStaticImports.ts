export type ImportStatement = {
  statement: string
  start: number
  end: number
}

export function collectStaticImports(script: string): ImportStatement[] {
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
    let detectionLine = line
    let trimmedLine = detectionLine.trim()

    if (isInsideBlockComment) {
      const blockCommentEnd = detectionLine.indexOf('*/')
      if (blockCommentEnd === -1) {
        lineIndex += 1
        continue
      }

      isInsideBlockComment = false
      detectionLine = detectionLine.slice(blockCommentEnd + 2)
      trimmedLine = detectionLine.trim()
    }

    while (trimmedLine.startsWith('/*')) {
      const blockCommentEnd = trimmedLine.indexOf('*/')

      if (blockCommentEnd === -1) {
        isInsideBlockComment = true
        break
      }

      trimmedLine = trimmedLine.slice(blockCommentEnd + 2).trimStart()
    }

    if (isInsideBlockComment) {
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

    if (!trimmedLine.startsWith('import')) {
      lineIndex += 1
      continue
    }

    if (trimmedLine.startsWith('import(')) {
      lineIndex += 1
      continue
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
        /^import\s+type\s+[\s\S]+?\s+from\s+['"][^'"]+['"]\s*;?$/.test(normalized) ||
        /^import\s+[\s\S]+?\s+from\s+['"][^'"]+['"]\s*;?$/.test(normalized) ||
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
