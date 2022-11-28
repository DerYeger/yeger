<h1 align="center">@yeger/vue2-masonry-wall</h1>

<p align="center">
  <img src="https://github.com/DerYeger/yeger/raw/main/docs/vue2-masonry-wall/public/logo.png" alt="Logo" width="48px" height="48px">
</p>

<p align="center">
  Responsive masonry layout with SSR support and zero dependencies for Vue 2.
</p>

<p align="center">
  <a href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/workflow/status/DerYeger/yeger/CI?label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/@yeger/vue2-masonry-wall">
    <img alt="NPM" src="https://img.shields.io/npm/v/@yeger/vue2-masonry-wall?logo=npm">
  </a>
  <a href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/vue2-masonry-wall">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=vue2-masonry-wall">
  </a>
  <a href="https://www.npmjs.com/package/vue">
    <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@yeger/vue2-masonry-wall/peer/vue">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/@yeger/vue2-masonry-wall?color=%234DC71F">
  </a>
  <a href="https://bundlephobia.com/package/@yeger/vue2-masonry-wall">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/@yeger/vue2-masonry-wall">
  </a>
</p>

## Features

- 📱 **Responsive**: Responsive with configurable column width and gaps. Based on `ResizeObserver`.
- 🔁 **Reactive**: Reacts to property changes.
- 🪶 **Lightweight**: Zero dependencies. Less than 1.7 kB.
- ⬅️ **RTL**: Supports LTR and RTL layouts.

## Links

- [Demo](https://vue2-masonry-wall.yeger.eu/)
- [Vue 3 version](https://github.com/DerYeger/yeger/tree/main/packages/vue-masonry-wall)
- [vue-masonry-wall by Fuxing Loh](https://github.com/fuxingloh/vue-masonry-wall)

## Installation

```bash
# yarn
$ yarn add @yeger/vue2-masonry-wall

# npm
$ npm install @yeger/vue2-masonry-wall
```

## Usage

```typescript
import Vue from 'vue'
import MasonryWall from '@yeger/vue2-masonry-wall'

Vue.use(MasonryWall)
```

Props:

- `items`: Array of items. Required.
- `column-width`: Minimal width of columns in `px`.
- `gap`: Spacing between items in `px`. Defaults to `0`.
- `rtl`: Toggles between LTR (`false`) and RTL (`true`) layouts. Defaults to `false`.
- `ssr-columns`: Number of server-side-rendered columns. Optional.

```vue
<script>
export default {
  data() {
    return {
      items: [
        { title: 'First', description: 'The first item.' },
        { title: 'Second', description: 'The second item.' },
      ],
    }
  },
}
</script>

<template>
  <masonry-wall :items="items" :ssr-columns="1" :column-width="300" :gap="16">
    <template #default="{ item, index }">
      <div style="height: 100px">
        <h1>{{ item.title }} ({{ index }})</h1>
        <span>{{ item.description }}</span>
      </div>
    </template>
  </masonry-wall>
</template>
```

## Development

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

[MIT](https://github.com/DerYeger/yeger/blob/main/packages/vue2-masonry-wall/LICENSE) - Copyright &copy; Fuxing Loh, Jan Müller
