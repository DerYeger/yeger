<p align="center">
  <img src="https://github.com/DerYeger/yeger/raw/main/docs/vecti-docs/public/logo.svg" alt="Logo" width="164px" height="164px">
</p>

<h1 align="center">Vecti</h1>

<p align="center">
    A tiny TypeScript library for 2D vector math.
</p>

<p align="center">
  <a href="https://vecti.yeger.eu">
    Documentation
  </a>
</p>

<p align="center">
  <a href="https://github.com/DerYeger/yeger/actions/workflows/ci.yml">
    <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/DerYeger/yeger/ci.yml?branch=main&label=ci&logo=github&color=#4DC71F">
  </a>
  <a href="https://www.npmjs.com/package/vecti">
    <img alt="NPM" src="https://img.shields.io/npm/v/vecti?logo=npm">
  </a>
  <a href="https://app.codecov.io/gh/DerYeger/yeger/tree/main/packages/vecti">
    <img alt="Coverage" src="https://codecov.io/gh/DerYeger/yeger/branch/main/graph/badge.svg?token=DjcvNlg4hd&flag=vecti">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="MIT" src="https://img.shields.io/npm/l/vecti?color=%234DC71F">
  </a>
</p>

## Features

- 🧮 Addition, subtraction, multiplication and division
- ✨ Dot, cross and Hadamard product
- 📏 Length and normalization
- 📐 Rotation by radians and degrees
- 🪨 Immutable data structure encourages chaining
- 💾 Tiny and typed

## Projects using Vecti

- [d3-graph-controller](https://github.com/DerYeger/yeger/tree/main/packages/d3-graph-controller) - Calculation of graph [edge paths](https://github.com/DerYeger/yeger/blob/main/packages/d3-graph-controller/src/lib/paths.ts)

## Installation

```bash
# yarn
$ yarn add vecti

# npm
$ npm install vecti
```

## Usage

Vectors have two properties, `x` and `y`, representing their components.
Since vectors are entirely immutable, they are read-only.

To use Vecti, add the following import to your TypeScript file.
Instances of the `Vector` class can be created either by using its constructor or the static method of the class.
The latter accepts a `number` array of length 2, with the first element being the x-axis component and the second element being the y-axis component.

```ts
import { Vector } from 'vecti'

// eslint-disable-next-line no-new
new Vector(42, 7) // == Vector { x: 42, y: 7 }

Vector.of([42, 7]) // == Vector { x: 42, y: 7 }
```

### Addition

Two vectors can be added using the `add` method.

```ts
const a = new Vector(0, 1)
const b = new Vector(1, 0)

a.add(b) // == Vector { x: 1, y: 1 }
```

### Subtraction

Two vectors can be subtracted using the `subtract` method.
The **parameter** is the **subtrahend** and the **instance** is the **minuend**.

```ts
const a = new Vector(2, 1)
const b = new Vector(1, 0)

a.subtract(b) // == Vector { x: 1, y: 0 }
```

### Multiplication

Vectors can be multiplied by scalars using the `multiply` method.

```ts
const a = new Vector(1, 0)

a.multiply(2) // == Vector { x: 2, y: 0 }
```

### Division

Vectors can be divided by scalars using the `divide` method.
The **parameter** is the **divisor** and the **instance** is the **dividend**.

```ts
const a = new Vector(4, 2)

a.divide(2) // == Vector { x: 2, y: 1 }
```

### Dot product

The dot product of two vectors can be calculated using the `dot` method.

```ts
const a = new Vector(2, 3)
const b = new Vector(1, 3)

a.dot(b) // == 11
```

### Cross product

The cross product of two vectors can be calculated using the `cross` method.
The cross product of two vectors `a` and `b` is defined as `a.x * b.y - a.y * b.x`.

```ts
const a = new Vector(2, 1)
const b = new Vector(1, 3)

a.cross(b) // == 5
```

### Hadamard product

The Hadamard product of two vectors can be calculated using the `hadamard` method.

```ts
const a = new Vector(2, 1)
const b = new Vector(1, 3)

a.hadamard(b) // == Vector { x: 2, y: 3 }
```

### Length

The length of a vector can be calculated using the `length` method.

Length is defined as the **L2 norm**.

```ts
const a = new Vector(1, 0)

a.length() // == 1

const b = new Vector(-3, 4)

b.length() // == 5
```

### Normalization

A normalized version of a vector can be calculated using the `normalize` method.
The resulting vector will have a length of **1**.

```ts
const a = new Vector(2, 0)

a.length() // == 2

const b = a.normalize() // == Vector { x: 1, y: 0 }

b.length() // == 1
```

### Rotation

Vectors can be rotated by radians or degrees using the methods `rotateByRadians` and `rotateByDegrees` respectively.

Due to the rotation using `Math.sin` and `Math.cos`, rounding errors can occur.
Notice that in the example below, the resulting x-component is **6.123233995736766e-17** and not **0** as expected.

```ts
const a = new Vector(1, 0)

a.rotateByDegrees(90) // == Vector { x: 6.123233995736766e-17, y: 1 }

a.rotateByRadians(Math.PI / 2) // == Vector { x: 6.123233995736766e-17, y: 1 }
```

### Chaining

Vecti encourages chaining methods to achieve readable and concise calculations.

```ts
import { Vector } from 'vecti'

new Vector(-5, 0)
  .normalize()
  .rotateByDegrees(180)
  .add(Vector.of([0, 1]))
  .multiply(42) // == Vector { x: 42, y: 41.99999999999999 }
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

[MIT](https://github.com/DerYeger/yeger/blob/main/packages/vecti/LICENSE) - Copyright &copy; Jan Müller
