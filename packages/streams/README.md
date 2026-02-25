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

## Benchmark

> Based on v3.3.0. Created with Vitest on a 2020 M1 MBP (16GB).

```
 ✓ test/toMap.bench.ts > toMap 16605ms
     name                              hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · streams                       479.03  2.0553  2.2889  2.0875  2.1168  2.2447  2.2724  2.2889  ±0.18%      480
   · streams with Map constructor  483.68  2.0532  2.1993  2.0675  2.0670  2.1702  2.1763  2.1993  ±0.09%      484
   · for-of                        515.65  1.9133  2.0702  1.9393  1.9310  2.0625  2.0680  2.0702  ±0.17%      516
   · for-of with Map constructor   513.47  1.9253  2.2424  1.9475  1.9564  2.0393  2.1103  2.2424  ±0.12%      514
   · for-i                         520.92  1.9129  2.0136  1.9197  1.9196  1.9648  1.9947  2.0136  ±0.05%      521
   · for-i with Map constructor    514.78  1.9258  2.2654  1.9426  1.9456  2.0733  2.1382  2.2654  ±0.14%      515
   · array                         3.4152  292.26  293.73  292.81  293.25  293.73  293.73  293.73  ±0.12%       10
   · array with Map constructor    3.4185  292.02  293.42  292.52  292.71  293.42  293.42  293.42  ±0.11%       10

 ✓ test/toSet.bench.ts > toSet 16616ms
     name                              hz     min      max    mean     p75     p99    p995     p999     rme  samples
   · streams                       489.23  2.0182   3.2579  2.0440  2.0421  2.1776  2.2280   3.2579  ±0.29%      490
   · streams with Set constructor  490.86  2.0169   2.2727  2.0372  2.0426  2.2035  2.2202   2.2727  ±0.13%      491
   · for-of                        504.08  1.9049  16.3690  1.9838  1.9718  2.3747  3.2587  16.3690  ±3.29%      505
   · for-of with Set constructor   517.26  1.9124   2.0954  1.9333  1.9412  2.0067  2.0244   2.0954  ±0.12%      518
   · for-i                         518.47  1.9059   2.1762  1.9288  1.9227  2.0920  2.0990   2.1762  ±0.18%      519
   · for-i with Set constructor    516.21  1.9139   2.1773  1.9372  1.9433  2.0419  2.1391   2.1773  ±0.14%      517
   · array                         3.4144  292.01   295.04  292.88  292.77  295.04  295.04   295.04  ±0.24%       10
   · array with Set constructor    3.4138  292.10   294.84  292.92  293.00  294.84  294.84   294.84  ±0.20%       10

 ✓ test/sum.bench.ts > sum 13294ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · streams            489.98  2.0143  3.0459  2.0409  2.0413  2.1665  2.1840  3.0459  ±0.25%      490
   · for-of             524.79  1.8993  2.0585  1.9055  1.9043  1.9472  1.9711  2.0585  ±0.06%      525
   · for-i              524.25  1.8990  2.1476  1.9075  1.9055  1.9595  2.0520  2.1476  ±0.08%      525
   · array              3.4107  292.02  294.72  293.19  294.05  294.72  294.72  294.72  ±0.23%       10
   · array with reduce  3.4158  292.14  293.86  292.76  292.90  293.86  293.86  293.86  ±0.13%       10

 ✓ test/toArray.bench.ts > toArray 8330ms
     name         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · streams  486.85  2.0185  3.2391  2.0540  2.0611  2.1958  2.2041  3.2391  ±0.28%      487
   · for-of   521.12  1.8995  2.1376  1.9190  1.9273  1.9989  2.0628  2.1376  ±0.11%      522
   · for-i    517.38  1.9000  2.1070  1.9328  1.9684  2.0336  2.0430  2.1070  ±0.15%      518
   · array    3.4105  292.11  296.39  293.22  293.71  296.39  296.39  296.39  ±0.34%       10

 BENCH  Summary

  for-of - test/sum.bench.ts > sum
    1.00x faster than for-i
    1.07x faster than streams
    153.64x faster than array with reduce
    153.87x faster than array

  for-of - test/toArray.bench.ts > toArray
    1.01x faster than for-i
    1.07x faster than streams
    152.80x faster than array

  for-i - test/toMap.bench.ts > toMap
    1.01x faster than for-of
    1.01x faster than for-i with Map constructor
    1.01x faster than for-of with Map constructor
    1.08x faster than streams with Map constructor
    1.09x faster than streams
    152.38x faster than array with Map constructor
    152.53x faster than array

  for-i - test/toSet.bench.ts > toSet
    1.00x faster than for-of with Set constructor
    1.00x faster than for-i with Set constructor
    1.03x faster than for-of
    1.06x faster than streams with Set constructor
    1.06x faster than streams
    151.85x faster than array
    151.87x faster than array with Set constructor
```
