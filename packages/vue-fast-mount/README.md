# vue-fast-mount

> Vite plugin for faster mounting of Vue components in Vitest.
> Read more in [this blog post](https://janmueller.dev/blog/vue-fast-mount/).

<p align="center">
  <a href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/DerYeger/yeger/ci.yml?branch=main&label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/vue-fast-mount">
    <img alt="NPM" src="https://img.shields.io/npm/v/vue-fast-mount?logo=npm">
  </a>
  <a href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/vue-fast-mount">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=vue-fast-mount">
  </a>
</p>

## Features

While `shallowMount` already skips mounting child components, it still imports them and their transitive dependencies.
With `vue-fast-mount`, SFCs are transformed to omit static imports of stubbed components.
This enables much faster tests, even for complex Vue applications with large import graphs.

> Note: This package only supports `<script setup>` components.

## Installation

```bash
pnpm add -D vue-fast-mount
```

## Usage

First, add the plugin to your Vite(st) config:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { vueFastMount } from 'vue-fast-mount'

export default defineConfig({
  plugins: [vue(), vueFastMount()],
})
```

`vueFastMount()` must stay after `vue()` in the plugin array so it can transform Vue's compiled output before Vite performs import analysis.

Then, within tests, add the import attribute `with { vfm: 'true' }` on static `.vue` imports:

```ts
import { describe, expect, test } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue' with { vfm: 'true' }

describe('MyComponent', () => {
  test('mounts the component', () => {
    const wrapper = shallowMount(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })
})
```

This will stub all child components and omit their imports.
To keep specific children unstubbed, pass their names as a comma-separated list:

```ts
import ParentWithSibling from './Parent.vue' with { vfm: 'Sibling,Header' }
```

Then pass the same component name in `shallowMount` options:

```ts
const wrapper = shallowMount(ParentWithSibling, {
  global: { stubs: { Sibling: false } },
})
```

> Note: The wrapper's HTML will differ from `shallowMount` if you are using import aliases.

### Options

- `debug`: Can be enabled to log transformed code. Defaults to `false`.
- `testFileRegex`: Determines the files, in which the `vfm` import attribute is used, that will have transformed imports. Defaults to `/\.(test|spec)\.[jt]sx?$/`.

## Considerations

- `vue-fast-mount` cannot reproduce the `shallowMount` behavior exactly, since imports are not resolved and thus props, emits, and component names have to be inferred.
- Names of stubbed components will be identical to their tag within the template.
- If you're using a child component's import as a value (and not just in the template), you **should** configure it to be unstubbed.
- Dynamic components will not be stubbed.
