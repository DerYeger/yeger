# vue-fast-mount

## 0.2.1

### Patch Changes

- b9a6a21: support kebab-case components
- b9a6a21: implement debug option
- b9a6a21: implement testFileRegex option
- b9a6a21: only transform test and vue files
- b9a6a21: only apply in test mode

## 0.2.0

### Minor Changes

- 8c71e55: switch to static import rewrites

## 0.1.2

### Patch Changes

- 321a652: do not create prop definitions for reserved attributes

## 0.1.1

### Patch Changes

- 8256642: do not omit possible prop candidates

## 0.1.0

### Minor Changes

- d379141: re-implement transformations using AST-based mutations
- d379141: improve compatibility by using sfc-compiler for analysis

### Patch Changes

- d379141: do not sort props and emits

  This improves transform time.

- c4cc40f: improve support for boolean shorthand props

## 0.0.7

### Patch Changes

- 688b579: improve prop and emit inference

## 0.0.6

### Patch Changes

- aeff4ab: support type inference for options

## 0.0.5

### Patch Changes

- 928d876: support multi-line import collection
- 928d876: fix prop and emit inference

## 0.0.4

### Patch Changes

- ecd68c1: support nested templates
- ecd68c1: do not create stubs for builtin components
- Updated dependencies [483e34e]
  - @yeger/streams@3.5.0

## 0.0.3

### Patch Changes

- a61baac: improve handling of multiple imports

## 0.0.2

### Patch Changes

- 8fa6de3: use shallowMount internally

## 0.0.1

### Patch Changes

- 032584a: initial release
