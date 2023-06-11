<h1 align="center">@yeger/vue-masonry-wall</h1>

<p align="center">
  <img src="https://github.com/DerYeger/yeger/raw/main/docs/vue-masonry-wall-docs/public/logo.png" alt="Logo" width="48px" height="48px">
</p>

<p align="center">
    Responsive masonry layout with SSR support and zero dependencies for Vue 3.
</p>

<p align="center">
  <a href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/DerYeger/yeger/ci.yml?branch=main&label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/@yeger/vue-masonry-wall">
    <img alt="NPM" src="https://img.shields.io/npm/v/@yeger/vue-masonry-wall?logo=npm">
  </a>
  <a href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/vue-masonry-wall">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=vue-masonry-wall">
  </a>
  <a href="https://www.npmjs.com/package/vue">
    <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@yeger/vue-masonry-wall/peer/vue">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/@yeger/vue-masonry-wall?color=%234DC71F">
  </a>
  <a href="https://bundlephobia.com/package/@yeger/vue-masonry-wall">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@yeger/vue-masonry-wall">
  </a>
</p>

## Features

- 📱 **Responsive**: Responsive with configurable column width and gaps. Based on `ResizeObserver`.
- 🔁 **Reactive**: Reacts to property changes.
- 🪶 **Lightweight**: Zero dependencies. Less than 1.4 kB.
- ⬅️ **RTL**: Supports LTR and RTL layouts.

## Links

- [Demo](https://vue-masonry-wall.yeger.eu/)
- [Vue 2 version](https://github.com/DerYeger/yeger/tree/main/packages/vue2-masonry-wall)

## Installation

```bash
# yarn
$ yarn add @yeger/vue-masonry-wall

# npm
$ npm install @yeger/vue-masonry-wall
```

## Usage

```typescript
import { createApp } from 'vue'
import MasonryWall from '@yeger/vue-masonry-wall'

const app = createApp()

app.use(MasonryWall)
```

Props:

- `items`: Array of items. Required.
- `column-width`: Minimal width of columns in `px`. Can be either a `number`, or a non-empty array of `number`s. Defaults to `300`. If an array is passed, the first value will be used for the first column, the second value for the second column, and so on. If the array is shorter than the number of columns, the pattern will be repeated starting at the first value.
- `gap`: Spacing between items in `px`. Defaults to `0`.
- `rtl`: Toggles between LTR (`false`) and RTL (`true`) layouts. Defaults to `false`.
- `ssr-columns`: Number of server-side-rendered columns. Optional.
- `scroll-container`: Scrolling `HTMLElement` parent element that will be used for restoring scroll position. If omitted, `window` is used.
- `min-columns`: Minimum number of columns. `undefined` implies no constraint. Defaults to `undefined`, but will always be at least `1` in the output.
- `max-columns`: Maximum number of columns. `undefined` implies no constraint. Defaults to `undefined`. If `min-columns` is greater than `max-columns`, `min-columns` will take precedence.
- `keyMapper`: Optional mapper function that receives an item, its column index, its row index, and its index w.r.t. the `items` array and returns a unique key. Defaults to `(_item, _column, _row, index) => index`.

```vue
<script setup lang="ts">
const items = [
  {
    title: 'First',
    description: 'The first item.',
  },
  {
    title: 'Second',
    description: 'The second item.',
  },
]
</script>

<template>
  <masonry-wall :items="items" :ssr-columns="1" :column-width="300" :gap="16">
    <template #default="{ item, index }">
      <div :style="{ height: `${index * 100}px` }">
        <h1>{{ item.title }}</h1>
        <span>{{ item.description }}</span>
      </div>
    </template>
  </masonry-wall>
</template>
```

### Adding items

To add new items, assign a new value to the `items` property, e.g., `items.value = [...items.value, newItem]`.
**DO NOT** push items to the array (e.g., `items.value.push(newItem)`), as such mutations will not be detected by the reactivity.

### Limitations

This library intentionally doesn't handle elements with dynamically changing height, as this would cause constant changes of the column distribution.
As a consequence, the initial height of items is used.
For images, specifying aspect ratios can prevent unbalanced distributions.

All columns have the same width, specified by the `column-width` property.
In addition, the elements of items should not set a specific width and instead be full-width, e.g., use `width: 100%`.

### Nuxt 3

Create a plugin (e.g., `plugins/vue-masonry-wall.ts`) with the following code:

```ts
import MasonryWall from '@yeger/vue-masonry-wall'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MasonryWall)
})
```

Also, see <https://github.com/DerYeger/yeger/issues/43>.

## Development

To serve or build the demo, the library has to be built first using `pnpm dev` or `pnpm build`.

```bash
# install dependencies
$ pnpm install

# develop in watch mode
$ pnpm dev

# build for production
$ pnpm build

# lint project files
$ pnpm lint

# run tests
$ pnpm test
```

## Disclaimer

This component originated as a modified version of [vue-masonry-wall](https://github.com/fuxingloh/vue-masonry-wall) by [Fuxing Loh](https://github.com/fuxingloh).

## License

[MIT](https://github.com/DerYeger/yeger/blob/main/packages/vue-masonry-wall/LICENSE) - Copyright &copy; Fuxing Loh, Jan Müller
