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
 ✓ test/toMap.bench.ts > toMap 16692ms
     name                              hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · streams                       478.97  2.0544  2.2820  2.0878  2.0979  2.2634  2.2668  2.2820  ±0.20%      479
   · streams with Map constructor  481.39  2.0541  2.3712  2.0773  2.0844  2.2275  2.2392  2.3712  ±0.15%      482
   · for-of                        520.75  1.9136  2.1565  1.9203  1.9187  1.9652  2.0011  2.1565  ±0.07%      521
   · for-of with Map constructor   512.75  1.9245  2.2733  1.9503  1.9643  2.0795  2.1570  2.2733  ±0.16%      513
   · for-i                         517.67  1.9128  2.1499  1.9317  1.9520  1.9850  1.9954  2.1499  ±0.09%      518
   · for-i with Map constructor    513.88  1.9254  2.1086  1.9460  1.9566  2.0780  2.0818  2.1086  ±0.12%      514
   · array                         3.4094  291.84  296.83  293.30  293.35  296.83  296.83  296.83  ±0.36%       10
   · array with Map constructor    3.3665  292.20  298.97  297.05  298.14  298.97  298.97  298.97  ±0.53%       10

 ✓ test/toRecord.bench.ts > toRecord 16765ms
     name                                 hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · streams                          468.59  2.0816  3.1168  2.1341  2.1413  2.2905  2.3069  3.1168  ±0.26%      469
   · streams with Object.fromEntries  468.39  2.1193  2.2530  2.1350  2.1407  2.2361  2.2454  2.2530  ±0.09%      469
   · for-of                           515.73  1.9107  2.1725  1.9390  1.9510  2.0334  2.1067  2.1725  ±0.12%      516
   · for-of with Object.fromEntries   499.13  1.9525  2.2485  2.0035  2.0107  2.0891  2.1254  2.2485  ±0.11%      500
   · for-i                            511.84  1.9110  2.1496  1.9537  1.9532  2.0300  2.0809  2.1496  ±0.10%      512
   · for-i with Object.fromEntries    500.11  1.9528  2.1977  1.9996  2.0141  2.1083  2.1514  2.1977  ±0.14%      501
   · array                            3.3742  292.20  299.73  296.37  298.60  299.73  299.73  299.73  ±0.69%       10
   · array with Object.fromEntries    3.3518  292.83  304.48  298.35  298.52  304.48  304.48  304.48  ±0.75%       10

 ✓ test/toSet.bench.ts > toSet 16724ms
     name                              hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · streams                       481.40  2.0239  3.0773  2.0773  2.0763  2.2092  2.2150  3.0773  ±0.24%      482
   · streams with Set constructor  489.44  2.0190  2.3280  2.0431  2.0585  2.1907  2.1997  2.3280  ±0.14%      490
   · for-of                        513.22  1.9424  2.1354  1.9485  1.9473  1.9887  2.0113  2.1354  ±0.05%      514
   · for-of with Set constructor   516.12  1.9133  2.4103  1.9375  1.9523  2.0453  2.0986  2.4103  ±0.17%      517
   · for-i                         520.64  1.9065  2.1394  1.9207  1.9269  1.9942  2.0120  2.1394  ±0.10%      521
   · for-i with Set constructor    516.95  1.9135  2.1506  1.9344  1.9521  2.0308  2.0835  2.1506  ±0.13%      517
   · array                         3.3942  292.46  297.70  294.62  295.41  297.70  297.70  297.70  ±0.44%       10
   · array with Set constructor    3.3595  292.37  328.07  297.66  298.02  328.07  328.07  328.07  ±2.63%       10

 ✓ test/sum.bench.ts > sum 13400ms
     name                   hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · streams            489.46  2.0141  2.9840  2.0431  2.0418  2.1612  2.1909  2.9840  ±0.24%      490
   · for-of             524.99  1.8985  2.0570  1.9048  1.9036  1.9457  1.9940  2.0570  ±0.06%      525
   · for-i              524.45  1.8981  2.1342  1.9067  1.9046  1.9657  2.0353  2.1342  ±0.08%      525
   · array              3.3856  292.19  300.19  295.37  298.39  300.19  300.19  300.19  ±0.74%       10
   · array with reduce  3.3695  292.20  298.88  296.78  298.36  298.88  298.88  298.88  ±0.59%       10

 ✓ test/toArray.bench.ts > toArray 8365ms
     name         hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · streams  489.21  2.0175  3.1949  2.0441  2.0505  2.1805  2.1871  3.1949  ±0.27%      490
   · for-of   515.19  1.9002  2.2280  1.9410  1.9483  2.0124  2.1895  2.2280  ±0.14%      516
   · for-i    514.08  1.9010  2.1190  1.9452  1.9555  2.0229  2.0414  2.1190  ±0.12%      515
   · array    3.3685  292.19  299.66  296.86  299.08  299.66  299.66  299.66  ±0.69%       10

 BENCH  Summary

  for-of - test/sum.bench.ts > sum
    1.00x faster than for-i
    1.07x faster than streams
    155.07x faster than array
    155.81x faster than array with reduce

  for-of - test/toArray.bench.ts > toArray
    1.00x faster than for-i
    1.05x faster than streams
    152.94x faster than array

  for-of - test/toMap.bench.ts > toMap
    1.01x faster than for-i
    1.01x faster than for-i with Map constructor
    1.02x faster than for-of with Map constructor
    1.08x faster than streams with Map constructor
    1.09x faster than streams
    152.74x faster than array
    154.69x faster than array with Map constructor

  for-of - test/toRecord.bench.ts > toRecord
    1.01x faster than for-i
    1.03x faster than for-i with Object.fromEntries
    1.03x faster than for-of with Object.fromEntries
    1.10x faster than streams
    1.10x faster than streams with Object.fromEntries
    152.85x faster than array
    153.87x faster than array with Object.fromEntries

  for-i - test/toSet.bench.ts > toSet
    1.01x faster than for-i with Set constructor
    1.01x faster than for-of with Set constructor
    1.01x faster than for-of
    1.06x faster than streams with Set constructor
    1.08x faster than streams
    153.39x faster than array
    154.97x faster than array with Set constructor
```
