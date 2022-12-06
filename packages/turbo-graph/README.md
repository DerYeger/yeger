# @yeger/turbo-graph

[![npm](https://img.shields.io/npm/v/@yeger/turbo-graph?color=a1b858&label=)](https://npmjs.com/package/@yeger/turbo-graph)

> Interactive visualization of Turborepo task graphs.

![Example Image](https://github.com/DerYeger/yeger/raw/main/packages/turbo-graph/docs/image.png)

## Installation

```bash
npm install --save-dev @yeger/turbo-graph
# or
yarn add -D @yeger/turbo-graph
# or
pnpm install -D @yeger/turbo-graph
```

## Usage

The visualization can be opened by running this package's `turbo-graph` command.
For simple usage, create a script in your root `package.json`.

```json
{
  "script": {
    "graph": "turbo-graph"
  }
}
```

Nodes represent your workspaces, i.e., packages.
Each workspace can have multiple nodes, each color defining the corresponding task (as seen in the toolbar).

### Controls

By right-clicking a node, only its (transitive) dependencies and dependents are shown.

Further, the checkboxes allow filtering nodes by their corresponding tasks.

The graph can be zoomed using the mouse-wheel and nodes may be dragged while holding the left mouse-button.

The "Reset" button centers the graph.

## License

[MIT](https://github.com/DerYeger/yeger/blob/main/packages/turbo-graph/LICENSE) - Copyright &copy; Jan Müller
