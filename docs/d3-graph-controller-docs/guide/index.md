# Guide

## Motivation

[D3](https://d3js.org/) is powerful but requires some effort to get good results.
Furthermore, managing a robust lifecycle with extensive customization options is downright difficult.
This library aims to make graph building a declarative task and provide an abstraction layer for the complexity of D3.

It does so by using an [extensive configuration](/config/) as the basis for creating graphs.
Everything should be configurable in a declarative way that is understandable without insight into the inner workings of D3.

In addition, models of graphs should be type-safe and extensible.
This library allows for custom node and link data types that extend the default model with custom properties.
These custom properties can then be used anywhere in the configuration.

Lastly, this library is framework-agnostic.
A graph's container element can be retrieved by any means, including [Vue's refs](https://v3.vuejs.org/guide/component-template-refs.html), [React's refs](https://reactjs.org/docs/refs-and-the-dom.html), [Angular's ViewChild](https://angular.io/api/core/ViewChild), or the old and trustworthy `document.getElementById`.
Just do not forget to [integrate the graph in the framework's lifecycle](/api/#shutdown).

## Installation

```bash
# with yarn
yarn add d3-graph-controller

# or with npm
npm install d3-graph-controller

# or with pnpm
pnpm add d3-graph-controller
```

## Usage

The data model of a graph can be customized to fit any need.
The following sections show a model with two node types, `primary` and `secondary`, custom node radius and link length as well as dynamic force strength.

### Type Tokens

First, define the types of nodes the graph may contain.

<<< @/guide/samples/custom-model.ts#token{0}

### Node

Then you can enhance the `GraphNode` interface with custom properties that can be accessed later on.

<<< @/guide/samples/custom-model.ts#node{0}

### Link

Analogous to nodes, `GraphLink` can be extended.
While not shown in the example below, `GraphLink` can have specific node types for `source` and `target`.

<<< @/guide/samples/custom-model.ts#link{0}

### Config

The config can then use the custom types.

<<< @/guide/samples/custom-model.ts#config{0}

### Model

The actual model can be created using the helper methods seen below.
They are type safe and support custom properties.

<<< @/guide/samples/custom-model.ts#model{0}

### Controller

The last step is putting it all together and creating the controller.

<<< @/guide/samples/custom-model.ts#controller{0}

::: tip
Do not forget to call `controller.shutdown()` when the graph is no longer required or your component will be destroyed.
:::

## Styling

The library provides default styles, which need to be imported manually.

<<< @/guide/samples/style-import.ts

In addition, the properties `color` and `fontSize` of nodes and links accept any valid CSS value.
This allows you to use dynamic colors with CSS variables.

<<< @/guide/samples/styling.css

<<< @/guide/samples/styling.ts

For customization of the default theme, the custom CSS properties `--color-stroke` and `--color-node-stroke` can be used.

### Classes

Graphs can also be styled using CSS.
For this purpose, various classes are defined.
Reference the table below for a description of all available classes.

| Class         | Element                 | Description                                                                             |
| ------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| `graph`       | Container of the graph  | Added to the graph's container on initialization.                                       |
| `link`        | Path of a link          |                                                                                         |
| `link__label` | Label of a link         |                                                                                         |
| `node`        | Circle of a node        |                                                                                         |
| `node__label` | Label of a node         |                                                                                         |
| `focused`     | Focused node            | Applied to a focused node. Recommended usage is `.node.focused`.                        |
| `dragged`     | Dragged nodes or canvas | Added to a node or the canvas while it is being dragged. Sets the cursor to `grabbing`. |

### Default Stylesheet

Usually, importing the default stylesheet and configuring variables should be enough to fit all needs.
If a full custom styling is required, the default stylesheet as seen below might act as a template.

<<< @/../../packages/d3-graph-controller/default.css
