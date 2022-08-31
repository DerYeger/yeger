<h1 align="center">@yeger/vue-masonry-wall</h1>

<p align="center">
  <img src="demo/public/logo.png" alt="Logo" width="48px" height="48px">
</p>

<p align="center">
    Responsive masonry layout with SSR support and zero dependencies for Vue 3.
</p>

<p align="center">
  <a href="https://github.com/DerYeger/vue-masonry-wall/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/workflow/status/DerYeger/vue-masonry-wall/CI?label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/@yeger/vue-masonry-wall">
    <img alt="NPM" src="https://img.shields.io/npm/v/@yeger/vue-masonry-wall?logo=npm">
  </a>
  <a href="https://codecov.io/gh/DerYeger/vue-masonry-wall">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/vue-masonry-wall/branch/master/graph/badge.svg?token=p35W6u2noe">
  </a>
  <a href="https://lgtm.com/projects/g/DerYeger/vue-masonry-wall">
    <img alt="LGTM Grade" src="https://img.shields.io/lgtm/grade/javascript/github/DerYeger/vue-masonry-wall?logo=lgtm">
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
- 🪶 **Lightweight**: Zero dependencies. Less than 1.3 kB.
- ⬅️ **RTL**: Supports LTR and RTL layouts.

## Links

- [Demo](https://vue-masonry-wall.yeger.eu/)
- [Vue 2 version](https://github.com/DerYeger/vue2-masonry-wall)
- [vue-masonry-wall by Fuxing Loh](https://github.com/fuxingloh/vue-masonry-wall)

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
- `column-width`: Minimal width of columns in `px`.
- `gap`: Spacing between items in `px`. Defaults to `0`.
- `rtl`: Toggles between LTR (`false`) and RTL (`true`) layouts. Defaults to `false`.
- `ssr-columns`: Number of server-side-rendered columns. Optional.
- `scroll-container`: Scrolling `HTMLElement` parent element that will be used for restoring scroll position. If omitted, `window` is used.

```vue
<script setup lang="ts">
const items = [
    {
      title: 'First',
      description: 'The first item.'
    },
    {
      title: 'Second',
      description: 'The second item.'
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
For images, specyfing aspect ratios can prevent unbalanced distributions.

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

Also, see https://github.com/DerYeger/vue-masonry-wall/issues/43.

## Development

To serve or build the demo, the library has to be built first using `yarn dev` or `yarn build`.

```bash
# install dependencies
$ yarn install

# build in watch mode
$ yarn dev

# build for production
$ yarn build

# lint project files
$ yarn lint

# serve demo
$ yarn demo:serve

# build demo for production
$ yarn demo:build
```

## Disclaimer

This component originated as a modified version of [vue-masonry-wall](https://github.com/fuxingloh/vue-masonry-wall) by [Fuxing Loh](https://github.com/fuxingloh).

## License

[MIT](./LICENSE) - Copyright &copy; Fuxing Loh, Jan Müller
