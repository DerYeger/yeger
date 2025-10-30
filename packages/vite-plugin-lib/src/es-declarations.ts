import { existsSync } from 'node:fs'
import { readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { normalizePath } from 'vite'

import { log } from './logger'

export async function generateMTSDeclarations(
  typesDir: string,
  deleteSourceFiles: boolean,
  verbose: boolean | undefined,
): Promise<void> {
  const files = await collectFiles(typesDir)
  for (const file of files) {
    await createMTSImports(file, verbose)
    if (deleteSourceFiles) {
      unlink(file)
    }
  }
  log(`Generated ${files.length} MTS declarations.`)
}

async function collectFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, {
    recursive: false, // does not provide full path to nested files
    withFileTypes: true,
  })
  const files = entries.filter((entry) => entry.isFile())
  const nestedFiles = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => collectFiles(normalizePath(path.join(dir, entry.name)))),
  )
  return files
    .map((file) => normalizePath(path.join(dir, file.name)))
    .concat(...nestedFiles)
}

async function createMTSImports(file: string, verbose: boolean | undefined) {
  const content = await readFile(file, 'utf-8')
  const lines = content.split('\n')
  const modified = lines.map((line) => transformLine(file, line, verbose))
  const targetFile = file.replace('.d.ts', '.d.mts')
  await writeFile(targetFile, modified.join('\n'))
}

function transformLine(
  file: string,
  line: string,
  verbose: boolean | undefined,
) {
  return (
    // eslint-disable-next-line style/quotes
    transformStaticImport(file, line, "'", verbose) ??
    transformStaticImport(file, line, '"', verbose) ??
    // eslint-disable-next-line style/quotes
    transformExport(file, line, "'", verbose) ??
    transformExport(file, line, '"', verbose) ??
    line
  )
}

function transformStaticImport(
  file: string,
  line: string,
  quote: string,
  verbose: boolean | undefined,
) {
  const importPathMarker = `from ${quote}`
  const isStaticImport =
    line.includes('import ') && line.includes(`${importPathMarker}.`)
  if (!isStaticImport) {
    return undefined
  }

  const importStartIndex = line.lastIndexOf(importPathMarker)
  const importPath = line.substring(
    importStartIndex + importPathMarker.length,
    line.length - 2,
  )
  const resolvedImport = path.resolve(path.dirname(file), importPath)
  if (existsSync(resolvedImport)) {
    if (verbose) {
      log(`got index import ${resolvedImport}`)
    }
    return `${line.substring(0, line.length - 2)}/index.mjs${quote};`
  }

  return `${line.substring(0, line.length - 2)}.mjs${quote};`
}

function transformExport(
  file: string,
  line: string,
  quote: string,
  verbose: boolean | undefined,
) {
  const exportPathMarker = ` from ${quote}`
  const isStaticExport =
    line.includes('export ') && line.includes(`${exportPathMarker}.`)
  if (!isStaticExport) {
    return undefined
  }

  const exportStartIndex = line.lastIndexOf(exportPathMarker)
  const exportPath = line.substring(
    exportStartIndex + exportPathMarker.length,
    line.length - 2,
  )
  const resolvedExport = path.resolve(path.dirname(file), exportPath)
  if (existsSync(resolvedExport)) {
    if (verbose) {
      log(`got index export ${resolvedExport}`)
    }
    return `${line.substring(0, line.length - 2)}/index.mjs${quote};`
  }

  return `${line.substring(0, line.length - 2)}.mjs${quote};`
}
