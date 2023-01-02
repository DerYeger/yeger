# vite-plugin-lib

> Vite plugin for build configuration, automatic aliases, and type declarations.

[![npm](https://img.shields.io/npm/v/vite-plugin-lib?color=a1b858&label=)](https://npmjs.com/package/vite-plugin-lib)

## Features

- Automatic aliases based on `tsconfig.json`
- Automatic build configuration
- Type declaration generation based on [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts).

## Installation

```bash
yarn add -D vite-plugin-lib
```

## Usage

This highly opinionated all-in one Vite plugin enables automatic alias configuration based on `tsconfig.json` paths, library export configuration, and type declaration generation.

### Aliases

```ts
import { defineConfig } from 'vite'

import { tsconfigPaths } from 'vite-plugin-lib'

export default defineConfig({
  plugins: [tsconfigPaths()],
})
```

### Library

The `library` plugin includes the `alias` plugin, configures build settings, and generates `.d.ts` files.

```ts
import { defineConfig } from 'vite'

import { library } from 'vite-plugin-lib'

export default defineConfig({
  plugins: [
    library({
      entry: 'src/index.ts', // file name determines output file names
      formats: ['es', 'umd'], // optional, default is ['es', 'umd']
      name: 'YourGlobalUMDName',
      external: ['some-package'], // optional, default is all node_modules and builtin modules
    }),
  ],
})
```
