<h1 align="center">@yeger/vue-masonry-wall</h1>

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
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue">
    <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/@yeger/vue-masonry-wall/peer/vue">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/@yeger/vue-masonry-wall?color=%234DC71F">
  </a>
  <a href="https://bundlephobia.com/package/@yeger/vue-masonry-wall">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/@yeger/vue-masonry-wall">
  </a>
</p>

> Responsive masonry layout with SSR support and zero dependencies for Vue 3.

## Features

- 📱 **Responsive**: Fully responsive with configurable padding and column width.
- 🔁 **Reactive**: Reacts to property changes.
- ✨ **Lightweight**: Zero dependencies.

## Links

- [Demo](https://vue-masonry-wall.yeger.eu/)
- [vue-masonry-wall for Vue 2](https://github.com/fuxingloh/vue-masonry-wall)

## Installation

```bash
# yarn
$ yarn add @yeger/vue-masonry-wall

# npm
$ npm install @yeger/vue-masonry-wall
```

## Usage

### Vue 3

```typescript
import { createApp } from 'vue'
import MasonryWall from '@yeger/vue-masonry-wall'

const app = createApp()

app.use(MasonryWall)
```

```vue
<template>
  <masonry-wall :items="items" :ssrColumns="1" :columnWidth="300" :padding="16">
    <template #default="{ item, index }">
      <div style="height: 100px">
        <h1>{{ item.title }}</h1>
        <span>{{ item.description }}</span>
      </div>
    </template>
  </masonry-wall>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: 'First', description: 'The first item.' },
        { title: 'Second', description: 'The second item.'},
      ]
    }
  }
}
</script>
```

## Development

```bash
# install dependencies
$ yarn install

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

This library is based on the Vue 2 component [vue-masonry-wall](https://github.com/fuxingloh/vue-masonry-wall) by [Fuxing Loh](https://github.com/fuxingloh).

## License

[MIT](./LICENSE) - Copyright &copy; Fuxing Loh, Jan Müller
