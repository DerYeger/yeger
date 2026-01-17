import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { builtinModules } from 'node:module'
import path from 'node:path'

import c from 'picocolors'
import type { CompilerOptions } from 'typescript'
import ts from 'typescript'
import type { Alias, AliasOptions, LibraryFormats, Plugin, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { generateMTSDeclarations } from './es-declarations'
import { log, logError, logWarn } from './logger'

export * as dts from 'vite-plugin-dts'

const typesDir = 'dist/types'

export interface CommonOptions {
  verbose: boolean
}

const COMMON_DEFAULTS = {
  verbose: false,
} satisfies Partial<CommonOptions>

export interface TSConfigPathsOptions extends CommonOptions {
  /** Path to the tsconfig file (relative to the project root). Defaults to `./tsconfig.json` */
  tsconfig: string
}

const TS_CONFIG_PATHS_OPTIONS = {
  ...COMMON_DEFAULTS,
  tsconfig: './tsconfig.json',
} satisfies Partial<TSConfigPathsOptions>

export interface BundleOptions {
  /** If `false`, all builtin modules will be externalized. Defaults to `false`. */
  builtin: boolean
  /** If `false`, all dependencies will be externalized. Defaults to `false`. */
  dependencies: boolean
  /** If `false`, all devDependencies will be externalized. Defaults to `true`. */
  devDependencies: boolean
  /** If `false`, all dependencies will be externalized. Defaults to `false`. */
  peerDependencies: boolean
  /** List of packages or modules to externalize. Defaults to `[]`. */
  exclude: (string | RegExp)[]
  /** List of packages or modules to bundle. Acts as an override and defaults to `[]`. */
  include: (string | RegExp)[]
  /** If `false`, all direct imports from `node_modules` will be externalized. Defaults to `false`. */
  nodeModules: boolean
}

const BUNDLE_DEFAULTS = {
  builtin: false,
  dependencies: false,
  devDependencies: true,
  peerDependencies: false,
  exclude: [],
  include: [],
  nodeModules: false,
} satisfies BundleOptions

export interface LibraryOptions extends TSConfigPathsOptions {
  /** Defaults to `src/index.ts`. */
  entry: string
  /** Bundle configuration for packages and modules. See {@link BundleOptions} for defaults. */
  bundle: Partial<BundleOptions>
  /** Defaults to `['es']`. */
  formats: LibraryFormats[]
  /** Defaults to `package.json`. */
  manifest: string
  name?: string
  /** Remove any temporary build files. Defaults to `true`. */
  cleanup: boolean
}

const LIBRARY_DEFAULTS = {
  ...TS_CONFIG_PATHS_OPTIONS,
  cleanup: true,
  entry: 'src/index.ts',
  bundle: {},
  formats: ['es'],
  manifest: 'package.json',
} satisfies Partial<LibraryOptions>

function mergeWithDefaults(options: Partial<LibraryOptions>): LibraryOptions {
  return {
    ...LIBRARY_DEFAULTS,
    ...options,
  }
}

export function tsconfigPaths(options: Partial<TSConfigPathsOptions> = {}): Plugin {
  const tsconfig = options.tsconfig ?? TS_CONFIG_PATHS_OPTIONS.tsconfig
  const verbose = options.verbose ?? TS_CONFIG_PATHS_OPTIONS.verbose
  return {
    name: 'vite-plugin-lib:alias',
    enforce: 'pre',
    config: async (config) => {
      const tsconfigPath = path.resolve(config.root ?? '.', tsconfig)
      const { baseUrl, paths } = await readConfig(tsconfigPath)
      if (!baseUrl || !paths) {
        log(`No paths found in ${tsconfig}.`)
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

function buildConfig({ entry, formats, manifest, name, bundle, verbose }: LibraryOptions): Plugin {
  const bundleWithDefaults = { ...BUNDLE_DEFAULTS, ...bundle }
  const packagesToExternalize = [
    ...getBuiltinModules(bundleWithDefaults),
    ...getDependencies(manifest, bundleWithDefaults, verbose),
    ...bundleWithDefaults.exclude,
  ]
  if (!bundleWithDefaults.nodeModules) {
    packagesToExternalize.push(/node_modules/)
    if (verbose) {
      log(`Externalized node_modules.`)
    }
  }
  return {
    name: 'vite-plugin-lib:build',
    enforce: 'pre',
    apply: 'build',
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
            external: (source: string, _importer: string | undefined, _isResolved: boolean) => {
              const shouldBeExternalized = packagesToExternalize.some((rule) =>
                matchesRule(source, rule),
              )
              const shouldBeBundled = bundleWithDefaults.include.some((rule) =>
                matchesRule(source, rule),
              )
              return shouldBeExternalized && !shouldBeBundled
            },
          },
        },
      }
    },
  }
}

function matchesRule(source: string, rule: string | RegExp) {
  return typeof rule === 'string' ? rule === source : rule.test(source)
}

function getDependencies(manifest: string, bundle: BundleOptions, verbose: boolean): string[] {
  try {
    const content = readFileSync(manifest, { encoding: 'utf-8' })
    const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = JSON.parse(content)
    const dependenciesToExternalize: string[] = []
    if (!bundle.dependencies) {
      const names = Object.keys(dependencies)
      dependenciesToExternalize.push(...names)
      if (verbose) {
        log(`Externalized ${names.length} dependencies.`)
      }
    }
    if (!bundle.devDependencies) {
      const names = Object.keys(devDependencies)
      dependenciesToExternalize.push(...names)
      if (verbose) {
        log(`Externalized ${names.length} devDependencies.`)
      }
    }
    if (!bundle.peerDependencies) {
      const names = Object.keys(peerDependencies)
      dependenciesToExternalize.push(...names)
      if (verbose) {
        log(`Externalized ${names.length} peerDependencies.`)
      }
    }
    return dependenciesToExternalize
  } catch (error) {
    const message = getErrorMessage(error)
    logError(`Could not read ${c.green(manifest)}: ${message}`)
    throw error
  }
}

function getBuiltinModules(bundle: BundleOptions) {
  if (bundle.builtin) {
    return []
  }
  log('Externalized builtin modules.')
  return [...builtinModules, /node:/, /bun:/, /deno:/]
}

function logInjectedAliases(aliasOptions: Alias[], config: UserConfig, verbose?: boolean) {
  log(`Injected ${c.green(aliasOptions.length)} aliases.`)
  if (!verbose) {
    return
  }
  const base = `${path.resolve(config.root ?? '.')}/`
  aliasOptions
    .map(
      ({ find, replacement }) =>
        `  ${c.gray('>')} ${c.green(find.toString())} ${c.gray(
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
    const replacement = getFirstExistingReplacement(tsconfigPath, baseUrl, replacements, find)
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
  const entryFileName = entry.substring(entry.lastIndexOf('/') + 1, entry.lastIndexOf('.'))
  if (format === 'es') {
    return `${entryFileName}.mjs`
  }
  if (format === 'cjs') {
    return `${entryFileName}.cjs`
  }
  return `${entryFileName}.${format}.js`
}

export function library(options: Partial<LibraryOptions> = {}): Plugin[] {
  const mergedOptions = mergeWithDefaults(options)
  const plugins = [
    tsconfigPaths(mergedOptions),
    buildConfig(mergedOptions),
    dts({
      cleanVueFileName: true,
      copyDtsFiles: true,
      include: `${path.resolve(mergedOptions.entry, '..')}/**`,
      outDir: typesDir,
      staticImport: true,
      tsconfigPath: mergedOptions.tsconfig,
      afterBuild: async () => {
        if (includesESFormat(mergedOptions.formats)) {
          await generateMTSDeclarations(
            typesDir,
            mergedOptions.formats?.length === 1,
            options.verbose,
          )
        }
      },
    }),
  ]

  if (mergedOptions.cleanup) {
    plugins.push(cleanup(mergedOptions))
  }

  return plugins
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

    const { options } = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configPath))
    return options
  } catch (error: any) {
    const message = getErrorMessage(error)
    logError(`Could not read ${configPath}: ${message}`)
    throw error
  }
}

function includesESFormat(formats?: LibraryFormats[]) {
  return formats?.includes('es') ?? true
}

function getErrorMessage(error: unknown) {
  const isObject = typeof error === 'object' && error !== null && 'message' in error
  return isObject ? error.message : String(error)
}

/**
 * Remove any temporary `vite.config.ts.timestamp-*` files.
 */
export function cleanup(options: Partial<CommonOptions> = {}): Plugin {
  const verbose = options.verbose ?? COMMON_DEFAULTS.verbose
  return {
    name: 'vite-plugin-lib:cleanup',
    enforce: 'post',
    closeBundle: () => {
      let deletedCount = 0
      readdirSync('.').forEach((file) => {
        if (!file.startsWith('vite.config.ts.timestamp-')) {
          return
        }
        rmSync(`./${file}`)
        deletedCount++
      })
      if (verbose) {
        log(`Removed ${deletedCount} temporary files.`)
      }
    },
  }
}
