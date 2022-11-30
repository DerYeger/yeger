# API

`GraphController` has various methods and properties for manipulating graphs at runtime.
These are described in the following sections.
The following setup is omitted from the samples for brevity.

<<< @/api/samples/setup.ts

## Methods

### Filter by Node Type

Graphs can be filtered by node types.
The filter can be updated at runtime as seen below.

<<< @/api/samples/node-type-filter.ts#snippet{0}

### Resize

While graphs can be [configured to resize automatically](/config/#resizing), manual resizing is also possible.

<<< @/api/samples/resize.ts#snippet{0}

### Restart

Simulations are automatically restarted when required.
Should the need arise in some edge cases, simulations can be manually restarted using `GraphController.restart`.

An alpha value defining the _heat_ of the simulation after restarting must be provided.

<<< @/api/samples/restart.ts#snippet{0}

### Shutdown

Graphs need to be integrated in framework lifecycles.
In particular, it is necessary to stop the simulation and the (optional) automatic resizing.

<<< @/api/samples/shutdown.ts#snippet{0}

::: danger
Not calling `GraphController.shutdown` when a graph is removed can cause memory leaks.
:::

## Properties

### Include Unlinked

Unlinked nodes, i.e., nodes without incoming or outgoing links, can be included or excluded.
The setting can be changed at runtime using the `includeUnlinked` property.
The property can also be read to get the current state.

<<< @/api/samples/include-unlinked.ts#snippet{0}

### Labels

Node and link labels can be toggled on and off using the respective property.
Both properties can also be read to get the current state.

<<< @/api/samples/labels.ts#snippet{0}

### Link Filter

Link filters can be changed at runtime by assigning a new value as seen below.
The property can also be read to get the current filter.

<<< @/api/samples/link-filter.ts#snippet{0}

### Node Types

An array of available and currently filtered node types can be read using properties seen below.

<<< @/api/samples/node-types.ts#snippet{0}
