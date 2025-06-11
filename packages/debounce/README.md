<h1 align="center">@yeger/debounce</h1>

<p align="center">
    A tiny TypeScript library for debouncing functions.
</p>

<p align="center">
  <a href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/DerYeger/yeger/ci.yml?branch=main&label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/@yeger/debounce">
    <img alt="NPM" src="https://img.shields.io/npm/v/@yeger/debounce?logo=npm">
  </a>
  <a href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/debounce">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=debounce">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/@yeger/debounce?color=%234DC71F">
  </a>
</p>

## Features

- ✨ **Debounce** any callback. Usefull for preventing flickering when using `ResizeObserver`.
- ⏱️ Optional **delays** for callback invocations.
- 🐭 **Tiny**.

## Installation

```bash
# yarn
$ yarn add @yeger/debounce

# npm
$ npm install @yeger/debounce
```

## Usage

```typescript
import { debounce } from '@yeger/debounce'

// Take an existing function
function resize(): void {
  // ...
}

// Debounce it using the library
const debouncedResize = debounce(() => resize())

// And use the debounced function
const resizeObserver = new ResizeObserver(debouncedResize)
```

Optionally, a delay for the invocation of the debounced method can be passed.

```typescript
const debouncedResize = debounce(() => resize(), 200)
```

## Development

```bash
# install dependencies
$ pnpm install

# build for production
$ pnpm build

# lint project files
$ pnpm lint

# run tests
$ pnpm test
```

## License

[MIT](https://github.com/DerYeger/yeger/blob/main/packages/debounce/LICENSE) - Copyright &copy; Jan Müller
