import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { builtinModules } from 'node:module'
import path from 'node:path'
import process from 'node:process'

import c from 'picocolors'
import type { CompilerOptions } from 'typescript'
import ts from 'typescript'
import type {
  Alias,
  AliasOptions,
  LibraryFormats,
  Plugin,
  UserConfig,
} from 'vite'
import dts from 'vite-plugin-dts'

import { generateMTSDeclarations } from './es-declarations'
import { log, logError, logWarn } from './logger'

export * as dts from 'vite-plugin-dts'

const typesDir = 'dist/types'

export const coverage = {
  enabled: !!process.env.COVERAGE,
  all: true,
  include: ['src/**/*.*'],
  provider: 'v8' as const,
}

export interface Options {
  /** Defaults to 'src/index.ts' */
  entry: string
  externalPackages?: (string | RegExp)[]
  /** Defaults to ['es'] */
  formats?: LibraryFormats[]
  /** Defaults to 'package.json' */
  manifest: string
  name?: string
  verbose?: boolean
}

const defaults = {
  entry: 'src/index.ts',
  formats: ['es'],
  manifest: 'package.json',
} satisfies Partial<Options>

function mergeWithDefaults(options: Partial<Options>): Options {
  return {
    ...defaults,
    ...options,
  }
}

export function tsconfigPaths(options: Partial<Options> = {}): Plugin {
  const { verbose } = mergeWithDefaults(options)
  return {
    name: 'vite-plugin-lib:alias',
    enforce: 'pre',
    config: async (config) => {
      const tsconfigPath = path.resolve(config.root ?? '.', 'tsconfig.json')
      const { baseUrl, paths } = await readConfig(tsconfigPath)
      if (!baseUrl || !paths) {
        log('No paths found in tsconfig.json.')
        return config
      }
      const pathToAlias = pathToAliasFactory(tsconfigPath, baseUrl, verbose)
      const aliasOptions = Object.entries(paths)
        .map(pathToAlias)
        .filter((alias) => alias !== undefined)
      if (aliasOptions.length > 0) {
        logInjectedAliases(aliasOptions, config, verbose)
      }
      const existingAlias = transformExistingAlias(config.resolve?.alias)
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: [...existingAlias, ...aliasOptions],
        },
      }
    },
  }
}

function buildConfig({
  entry,
  formats,
  manifest,
  name,
  externalPackages,
}: Options): Plugin {
  if (!externalPackages) {
    log('Externalized all packages.')
  }
  return {
    name: 'vite-plugin-lib:build',
    enforce: 'pre',
    config: async (config) => {
      return {
        ...config,
        build: {
          ...config.build,
          lib: {
            ...config.build?.lib,
            entry: path.resolve(config.root ?? '.', entry),
            formats,
            name,
            fileName: (format: string) => formatToFileName(entry, format),
          },
          rollupOptions: {
            external: externalPackages ?? [
              /node_modules/,
              ...builtinModules,
              /node:/,
              ...getDependencies(manifest),
            ],
          },
        },
      }
    },
  }
}

function getDependencies(manifest: string): string[] {
  try {
    const content = readFileSync(manifest, { encoding: 'utf-8' })
    const { dependencies = {}, peerDependencies = {} } = JSON.parse(content)
    return Object.keys({ ...dependencies, ...peerDependencies })
  } catch (error) {
    const message = getErrorMessage(error)
    logError(`Could not read ${c.green(manifest)}: ${message}`)
    throw error
  }
}

function logInjectedAliases(
  aliasOptions: Alias[],
  config: UserConfig,
  verbose?: boolean,
) {
  log(`Injected ${c.green(aliasOptions.length)} aliases.`)
  if (!verbose) {
    return
  }
  const base = `${path.resolve(config.root ?? '.')}/`
  aliasOptions
    .map(
      ({ find, replacement }) =>
        `${c.gray('>')} ${c.green(find.toString())} ${c.gray(
          c.bold('->'),
        )} ${c.green(replacement.replace(base, ''))}`,
    )
    .forEach(log)
}

function pathToAliasFactory(
  tsconfigPath: string,
  baseUrl: string,
  verbose?: boolean,
): (path: [string, string[]]) => Alias | undefined {
  return ([alias, replacements]) => {
    if (replacements.length === 0) {
      if (verbose) {
        logWarn(`No replacements for alias ${c.green(alias)}.`)
      }
      return undefined
    }
    if (verbose && replacements.length > 1) {
      logWarn(`Found more than one replacement for alias ${c.green(alias)}.`)
      logWarn('Using the first existing replacement.')
    }
    const find = alias.replace('/*', '')
    const replacement = getFirstExistingReplacement(
      tsconfigPath,
      baseUrl,
      replacements,
      find,
    )
    if (!replacement) {
      if (verbose) {
        logWarn(`No replacement found for alias ${c.green(alias)}.`)
      }
      return undefined
    }
    return {
      find,
      replacement,
    }
  }
}

function getFirstExistingReplacement(
  tsconfigPath: string,
  baseUrl: string,
  replacements: string[],
  find: string,
  verbose?: boolean,
): string | undefined {
  for (const replacement of replacements) {
    const resolvedReplacement = path.resolve(
      tsconfigPath,
      baseUrl,
      replacement.replace('/*', '') ?? find,
    )
    if (existsSync(resolvedReplacement)) {
      return resolvedReplacement
    } else if (verbose) {
      logWarn(`Path ${c.green(replacement)} does not exist.`)
    }
  }
  return undefined
}

function formatToFileName(entry: string, format: string): string {
  const entryFileName = entry.substring(
    entry.lastIndexOf('/') + 1,
    entry.lastIndexOf('.'),
  )
  if (format === 'es') {
    return `${entryFileName}.mjs`
  }
  if (format === 'cjs') {
    return `${entryFileName}.cjs`
  }
  return `${entryFileName}.${format}.js`
}

export function library(options: Partial<Options> = {}): Plugin[] {
  const mergedOptions = mergeWithDefaults(options)
  return [
    tsconfigPaths(),
    buildConfig(mergedOptions),
    dts({
      cleanVueFileName: true,
      copyDtsFiles: true,
      include: `${path.resolve(mergedOptions.entry, '..')}/**`,
      outDir: typesDir,
      staticImport: true,
      afterBuild: includesESFormat(mergedOptions.formats)
        ? () =>
            generateMTSDeclarations(
              typesDir,
              mergedOptions.formats?.length === 1,
              options.verbose,
            )
        : undefined,
    }),
  ]
}

function transformExistingAlias(alias: AliasOptions | undefined): Alias[] {
  if (!alias) {
    return []
  }
  if (Array.isArray(alias)) {
    return alias
  }
  return Object.entries(alias).map(([find, replacement]) => ({
    find,
    replacement,
  }))
}

async function readConfig(configPath: string): Promise<CompilerOptions> {
  try {
    const configFileText = await readFile(configPath, { encoding: 'utf-8' })

    const { config } = ts.parseConfigFileTextToJson(configPath, configFileText)
    if (!('baseUrl' in config?.compilerOptions)) {
      throw new Error('No baseUrl provided in tsconfig.json.')
    }

    const { options } = ts.parseJsonConfigFileContent(
      config,

      ts.sys,
      path.dirname(configPath),
    )
    return options
  } catch (error: any) {
    const message = getErrorMessage(error)
    logError(`Could not read tsconfig.json: ${message}`)
    throw error
  }
}

function includesESFormat(formats?: LibraryFormats[]) {
  return formats?.includes('es') ?? true
}

function getErrorMessage(error: unknown) {
  const isObject =
    typeof error === 'object' && error !== null && 'message' in error
  return isObject ? error.message : String(error)
}
