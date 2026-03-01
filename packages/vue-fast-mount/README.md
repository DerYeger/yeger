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
With `fastMount`, SFCs are transformed to omit static imports of stubbed components.
This enables much faster tests, even for complex Vue applications with large import graphs.

> Warning: While tests have been hand-crafted to cover expected usage scenarios, the implementation is mostly AI-generated.
> Use this package with caution.

> Note: This package only supports `<script setup>` components.

## Installation

```bash
pnpm add -D vue-fast-mount
```

## Usage

First, add the plugin to your Vite(st) config.

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { vueFastMount } from 'vue-fast-mount/plugin'

export default defineConfig({
  plugins: [vue(), vueFastMount()],
})
```

Then, use `fastMount` as a replacement for `shallowMount`:

```ts
import { describe, expect, test } from 'vitest'
import { fastMount } from 'vue-fast-mount'

describe('MyComponent', () => {
  test('mounts the component', async () => {
    const wrapper = await fastMount(import('./MyComponent.vue'))
    expect(wrapper.exists()).toBe(true)
  })
})
```

> Note: The wrapper's HTML will differ from `shallowMount` if you are using aliased imports.

## Considerations

`vue-fast-mount` cannot reproduce the `shallowMount` behavior exactly, since imports are not resolved and thus props, emits, and component names have to be inferred.
