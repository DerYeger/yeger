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

> Based on v3.1.0. Created with Vitest on a 2020 M1 MBP (16GB).

```
 ✓ test/toMap.bench.ts 6888ms
     name                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · streams                   16,589.97   0.0589   0.9880   0.0603   0.0599   0.0674   0.0703   0.0963  ±0.20%    16590
   · streams with early limit  16,493.54   0.0591   0.2373   0.0606   0.0599   0.0790   0.0795   0.1031  ±0.11%    16494
   · for-of                      34.3844  28.9585  29.4728  29.0830  29.0707  29.4728  29.4728  29.4728  ±0.15%       35
   · for-of intermediate          171.17   5.7896   6.1364   5.8422   5.8503   6.0430   6.1364   6.1364  ±0.15%      172
   · array                       34.5864  28.8239  29.1558  28.9131  28.9306  29.1558  29.1558  29.1558  ±0.09%       35
   · array with early limit     7,681.13   0.1258   0.7279   0.1302   0.1299   0.1613   0.1785   0.1903  ±0.16%     7682

 ✓ test/toMap.bench.ts 6888ms
     name                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · streams                   16,589.97   0.0589   0.9880   0.0603   0.0599   0.0674   0.0703   0.0963  ±0.20%    16590
   · streams with early limit  16,493.54   0.0591   0.2373   0.0606   0.0599   0.0790   0.0795   0.1031  ±0.11%    16494
   · for-of                      34.3844  28.9585  29.4728  29.0830  29.0707  29.4728  29.4728  29.4728  ±0.15%       35
   · for-of intermediate          171.17   5.7896   6.1364   5.8422   5.8503   6.0430   6.1364   6.1364  ±0.15%      172
   · array                       34.5864  28.8239  29.1558  28.9131  28.9306  29.1558  29.1558  29.1558  ±0.09%       35
   · array with early limit     7,681.13   0.1258   0.7279   0.1302   0.1299   0.1613   0.1785   0.1903  ±0.16%     7682

 ✓ test/toSet.bench.ts 7987ms
     name                                    hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · streams                          16,543.93   0.0590   0.9901   0.0604   0.0598   0.0709   0.0760   0.0955  ±0.20%    16544
   · streams with intermediate array  16,568.78   0.0589   0.1839   0.0604   0.0597   0.0784   0.0790   0.0929  ±0.09%    16569
   · streams with early limit         16,522.64   0.0591   0.1896   0.0605   0.0598   0.0784   0.0791   0.0956  ±0.10%    16523
   · for-of                             34.4522  28.9065  29.5322  29.0257  29.0393  29.5322  29.5322  29.5322  ±0.17%       35
   · for-of intermediate                 171.97   5.7761   6.0859   5.8151   5.8280   6.0437   6.0859   6.0859  ±0.12%      172
   · array                              34.5285  28.8259  29.8520  28.9616  28.9320  29.8520  29.8520  29.8520  ±0.25%       35
   · array with early limit            7,708.85   0.1260   0.5666   0.1297   0.1297   0.1618   0.1784   0.1929  ±0.13%     7709

 ✓ test/toSet.bench.ts 7987ms
     name                                    hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · streams                          16,543.93   0.0590   0.9901   0.0604   0.0598   0.0709   0.0760   0.0955  ±0.20%    16544
   · streams with intermediate array  16,568.78   0.0589   0.1839   0.0604   0.0597   0.0784   0.0790   0.0929  ±0.09%    16569
   · streams with early limit         16,522.64   0.0591   0.1896   0.0605   0.0598   0.0784   0.0791   0.0956  ±0.10%    16523
   · for-of                             34.4522  28.9065  29.5322  29.0257  29.0393  29.5322  29.5322  29.5322  ±0.17%       35
   · for-of intermediate                 171.97   5.7761   6.0859   5.8151   5.8280   6.0437   6.0859   6.0859  ±0.12%      172
   · array                              34.5285  28.8259  29.8520  28.9616  28.9320  29.8520  29.8520  29.8520  ±0.25%       35
   · array with early limit            7,708.85   0.1260   0.5666   0.1297   0.1297   0.1618   0.1784   0.1929  ±0.13%     7709

 ✓ test/sum.bench.ts 5648ms
     name                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · streams                   16,609.03   0.0587   0.9725   0.0602   0.0596   0.0718   0.0783   0.0917  ±0.20%    16610
   · streams with early limit  16,600.36   0.0590   0.2085   0.0602   0.0596   0.0765   0.0789   0.0933  ±0.09%    16601
   · for-of                    17,275.93   0.0571   0.6520   0.0579   0.0577   0.0625   0.0694   0.0859  ±0.13%    17276
   · array                       34.5782  28.8365  29.3151  28.9200  28.9185  29.3151  29.3151  29.3151  ±0.12%       35
   · array with early limit     7,693.98   0.1262   0.5522   0.1300   0.1298   0.1620   0.1766   0.1900  ±0.13%     7694

 ✓ test/sum.bench.ts 5648ms
     name                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · streams                   16,609.03   0.0587   0.9725   0.0602   0.0596   0.0718   0.0783   0.0917  ±0.20%    16610
   · streams with early limit  16,600.36   0.0590   0.2085   0.0602   0.0596   0.0765   0.0789   0.0933  ±0.09%    16601
   · for-of                    17,275.93   0.0571   0.6520   0.0579   0.0577   0.0625   0.0694   0.0859  ±0.13%    17276
   · array                       34.5782  28.8365  29.3151  28.9200  28.9185  29.3151  29.3151  29.3151  ±0.12%       35
   · array with early limit     7,693.98   0.1262   0.5522   0.1300   0.1298   0.1620   0.1766   0.1900  ±0.13%     7694

 ✓ test/toArray.bench.ts 5684ms
     name                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · streams                   16,586.23   0.0588   0.3368   0.0603   0.0597   0.0733   0.0789   0.0945  ±0.10%    16587
   · streams with early limit  16,548.15   0.0590   0.2213   0.0604   0.0598   0.0785   0.0790   0.0954  ±0.10%    16549
   · for-of                       171.04   5.7713   6.6284   5.8467   5.8496   6.5592   6.6284   6.6284  ±0.32%      172
   · array                       34.2164  28.8110  30.0734  29.2257  29.8246  30.0734  30.0734  30.0734  ±0.54%       35
   · array with early limit     7,684.82   0.1259   0.5969   0.1301   0.1309   0.1620   0.1757   0.2002  ±0.15%     7685

 ✓ test/toArray.bench.ts 5684ms
     name                             hz      min      max     mean      p75      p99     p995     p999     rme  samples
   · streams                   16,586.23   0.0588   0.3368   0.0603   0.0597   0.0733   0.0789   0.0945  ±0.10%    16587
   · streams with early limit  16,548.15   0.0590   0.2213   0.0604   0.0598   0.0785   0.0790   0.0954  ±0.10%    16549
   · for-of                       171.04   5.7713   6.6284   5.8467   5.8496   6.5592   6.6284   6.6284  ±0.32%      172
   · array                       34.2164  28.8110  30.0734  29.2257  29.8246  30.0734  30.0734  30.0734  ±0.54%       35
   · array with early limit     7,684.82   0.1259   0.5969   0.1301   0.1309   0.1620   0.1757   0.2002  ±0.15%     7685

 BENCH  Summary

  for-of - test/sum.bench.ts
    1.04x faster than streams
    1.04x faster than streams with early limit
    2.25x faster than array with early limit
    499.62x faster than array

  streams - test/toArray.bench.ts
    1.00x faster than streams with early limit
    2.16x faster than array with early limit
    96.97x faster than for-of
    484.75x faster than array

  streams - test/toMap.bench.ts
    1.01x faster than streams with early limit
    2.16x faster than array with early limit
    96.92x faster than for-of intermediate
    479.67x faster than array
    482.49x faster than for-of

  streams with intermediate array - test/toSet.bench.ts
    1.00x faster than streams
    1.00x faster than streams with early limit
    2.15x faster than array with early limit
    96.35x faster than for-of intermediate
    479.86x faster than array
    480.92x faster than for-of
```
