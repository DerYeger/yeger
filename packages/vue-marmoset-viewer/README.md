<h1 align="center">vue-marmoset-viewer</h1>

<p align="center">
  <a href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/DerYeger/yeger/ci.yml?branch=main&label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/vue-marmoset-viewer">
    <img alt="NPM" src="https://img.shields.io/npm/v/vue-marmoset-viewer?logo=npm">
  </a>
  <a href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/vue-marmoset-viewer">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=vue-marmoset-viewer">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue">
    <img alt="npm peer dependency version" src="https://img.shields.io/npm/dependency-version/vue-marmoset-viewer/peer/vue">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/vue-marmoset-viewer?color=#4DC71F">
  </a>
  <a href="https://bundlephobia.com/package/vue-marmoset-viewer">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/vue-marmoset-viewer">
  </a>
</p>

> A responsive and configurable [Marmoset Viewer](https://marmoset.co/toolbag/viewer/) component for Vue.

## Features

- ✨ **Dynamic**: Dynamically loads the Marmoset Viewer source code as soon as its required.
- 📱 **Responsive**: Fully responsive. Supports touch controls.
- 🔁 **Reactive**: Reacts to property changes.
- ⚒️ **Manual access**: If required, directly access the Marmoset script with provided type declarations.

## Links

- [Marmoset Viewer](https://marmoset.co/toolbag/viewer/)
- [Demo](https://vue-marmoset-viewer.yeger.eu/)

## Installation

> v1.x.x supports Vue 2, while v2.0.0 and onward target Vue 3.

```bash
# yarn
$ yarn add vue-marmoset-viewer

# npm
$ npm install vue-marmoset-viewer
```

## Usage

### Vue 3

```typescript
import { createApp } from 'vue'
import { MarmosetViewer } from 'vue-marmoset-viewer'

const app = createApp()

app.use(MarmosetViewer)
```

### Vue 2

```typescript
import Vue from 'vue'
import MarmosetViewer from 'vue-marmoset-viewer'

Vue.use(MarmosetViewer)
```

```vue
<template>
  <marmoset-viewer
    src="/file.mview"
    :width="800"
    :height="600"
    :auto-start="true"
  />
</template>
```

or

```vue
<template>
  <marmoset-viewer src="/file.mview" responsive />
</template>
```

If `responsive` is set to true, the component will fill the available space of its parent.

> Note: All properties of the component are reactive.

### Events

- `load`: Emitted when the underlying viewer is done loading.
- `unload`: Emitted when an underlying viewer has been unloaded, because the component is destroyed or recreated.
- `resize`: Emitted when the underlying viewer has been resized manually or automatically, when the `responsive` property is set to `true`.

### Nuxt

> Nuxt 2 is not supported by v2.0.0 and onward.

1. Create the file `plugins/marmosetViewer.ts` with the following content.

```typescript
import Vue from 'vue'
import MarmosetViewer from 'vue-marmoset-viewer'

Vue.use(MarmosetViewer)
```

2. Update the `plugins` array in `nuxt.config.js`.

```typescript
export default {
  plugins: [{ src: '~/plugins/marmosetViewer.ts' }],
}
```

### Manual usage

In addition to the component, this library also allows for direct access of the Marmoset script.
After the `Promise` returned by `loadMarmoset()` is resolved, the script can be accessed at `document.marmoset`.
While the required types are included in this library, keep in mind that this can only be done client-side, as it requires `document` to be available.

### Options

The following options are available (taken from <https://marmoset.co/posts/viewer-integration-guide/>):

| Type    | Name      | Default | Description                                                                                                                                                         |
| ------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| number  | width     | 800     | Width of viewer frame in points. This setting is ignored in full frame mode.                                                                                        |
| number  | height    | 600     | Height of viewer frame in points. This setting is ignored in full frame mode.                                                                                       |
| boolean | autoStart | false   | Starts the viewer loading process immediately upon load (user does not have to press the play button). Leaving this disabled can save bandwidth and page load time. |

In addition, the following options can be set when embedding a Marmoset viewer manually.

| Type    | Name         | Default   | Description                                                                                                                                                                                              |
| ------- | ------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| boolean | fullFrame    | false     | When enabled, stretches the viewer rectangle to fill the available frame (the containing window or iframe). This setting is ignored when the “pagePreset” option is enabled.                             |
| boolean | pagePreset   | false     | When enabled, constructs a full standalone web page around the viewer, with a resizable frame. Useful for creating a simple, decent-looking presentation without having to construct a page yourself.    |
| string  | thumbnailURL | undefined | If supplied, this image URL will be used for the load screen instead of the thumbnail extracted from the mview file. For best results, ensure that the given URL will not cause a cross-origin conflict. |

## Development

```bash
# install dependencies
$ pnpm install

# build for production
$ pnpm build

# lint project files
$ pnpm lint
```

## Disclaimer

Please keep the license of the Marmoset Viewer, which will be loaded dynamically, in mind.
The (current) license is as follows:

```text
Copyright (c) Marmoset LLC.
All rights reserved.

Redistribution and use of this software are permitted provided
that the software remains whole and unmodified and this copyright
notice remains attached. Use or inclusion of any portion of this
code in other software programs is prohibited, excepting simple
embedding of this file in web applications. This software, or any
derivatives thereof, may not be resold, rented, leased, or
distributed on any other for-charge basis.

THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, WITHOUT LIMITATION, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
```

## License

[MIT](https://github.com/DerYeger/yeger/blob/main/packages/vue-marmoset-viewer/LICENSE) - Copyright &copy; Jan Müller
