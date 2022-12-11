# vite-plugin-ssg-utils

> Utils for vite-ssg and other Vite SSG or SSR tools.

[![npm](https://img.shields.io/npm/v/vite-plugin-ssg-utils?color=a1b858&label=)](https://npmjs.com/package/vite-plugin-ssg-utils)

## Features

- Mocking of `ResizeObserver` for SSR and SSG builds

## Installation

```bash
yarn add -D vite-plugin-ssg-utils
```

## Usage

The plugin will only be applied when the `build` command is used and `config.build.ssr` is truthy.
This is the case when using tools like [vite-ssg](https://github.com/antfu/vite-ssg).

```ts
import { defineConfig } from 'vite'
import SSGUtils from 'vite-plugin-ssg-utils'

export default defineConfig({
  plugins: [
    // The options are not required.
    // Default values are used in the following example.
    SSGUtils({
      resizeObserver: true,
    }),
    // ...other plugins
  ],
  // ...remaining config
})
```

### Options

Optionally, the plugin can be configured with the following options.

#### `resizeObserver`

| Value                      | Description                               |
| -------------------------- | ----------------------------------------- |
| `true` (default)           | Mock `ResizeObserver` using a dummy class |
| `false`                    | Do not mock `ResizeObserver`              |
| `new () => ResizeObserver` | Mock `ResizeObserver` with a custom class |
