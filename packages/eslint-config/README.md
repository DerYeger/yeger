# @yeger/eslint-config

[![npm](https://img.shields.io/npm/v/@yeger/eslint-config?color=a1b858&label=)](https://npmjs.com/package/@yeger/eslint-config)

## Installation

```bash
yarn add -D eslint @yeger/eslint-config
```

## Usage

```json
{
  "extends": ["@yeger"]
}
```

While using the standard `eslint` command is possible, the `yeger-lint` command automatically includes all supported files in the current directory:

```json
{
  "scripts": {
    "lint": "yeger-lint",
    "lint:fix": "yeger-lint --fix"
  }
}
```
