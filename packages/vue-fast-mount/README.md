# vue-fast-mount

> Vite plugin for faster mounting of Vue components in Vitest.

[![npm](https://img.shields.io/npm/v/vue-fast-mount?color=a1b858&label=)](https://npmjs.com/package/vue-fast-mount)

## Features

While `shallowMount` already skips mounting child components, it still imports them and their transitive dependencies.
With `fastMount`, imports are transformed to omit static imports of stubbed components.
This enables much faster tests, even for complex Vue applications with large import graphs.

> Warning: While tests have been hand-crafted to cover expected usage scenarios, the implementation is mostly AI-generated.
> Use this package with caution.

> Note: This package only supports `<script setup>` components.

## Installation

```bash
pnpm install -D vue-fast-mount
```

## Usage

First, add the plugin to your Vite(st) config.

```ts vitest.config.ts
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
