<h1 align="center">@yeger/streams</h1>

<p align="center">
    Type-safe utilities for building synchronous and asynchronous iterable streams.
</p>

<p align="center">
  <a href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/DerYeger/yeger/ci.yml?branch=main&label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/@yeger/streams">
    <img alt="NPM" src="https://img.shields.io/npm/v/@yeger/streams?logo=npm">
  </a>
  <a href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/yeger/streams">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=streams">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/@yeger/streams?color=%234DC71F">
  </a>
</p>

## Installation

```bash
pnpm add @yeger/streams
```

## Features

- Composable operators like `map`, `filter`, `flatMap`, `distinct`, and `limit`
- Generator composition with `pipe`
- Collectors and reducers like `toArray`, `toMap`, `reduce`, `sum`, and `join`
- Separate sync and async entry points with tree-shaking support

## Usage

### Synchronous streams

```ts
import { toArray, pipe, map, limit } from '@yeger/streams/sync'

const result = toArray(
  pipe(
    [1, 2, 3, 4],
    map((x) => x + 1),
    limit(3),
  ),
)
```

or

```ts
import * as s from '@yeger/streams/sync'

const result = s.toArray(
  s.pipe(
    [1, 2, 3, 4],
    s.map((x) => x + 1),
    s.limit(3),
  ),
)
```

### Asynchronous streams

```ts
import { toArray, pipe, map, limit } from '@yeger/streams/async'

const result = toArray(
  pipe(
    [1, 2, 3, 4],
    map((x) => x + 1),
    limit(3),
  ),
)
```

or

```ts
import * as as from '@yeger/streams/async'

const result = as.toArray(
  as.pipe(
    [1, 2, 3, 4],
    as.map((x) => x + 1),
    as.limit(3),
  ),
)
```
