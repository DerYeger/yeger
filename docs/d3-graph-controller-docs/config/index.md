# Configuration

Both behavior and visuals of graphs can be customized by passing additional parameters to `defineGraphConfig()`.

## Callbacks

### nodeClicked

The `nodeClicked` callback is called whenever a node is double-clicked (using the primary mouse button) or double-tapped in a short time.
If set, the default behavior of focusing a node is disabled.

<<< @/config/samples/callbacks.ts

## Initial Settings

The `GraphController` settings that can be changed after initialization can have their initial values configured.
The reference below shows the default configuration.

`linkFilter` receives a link as its parameter.

`nodeTypeFilter` is an array of type tokens.
Only nodes whose type is included in the array will be shown.
If omitted, the graph will include all nodes.

<<< @/config/samples/initial.ts

## Markers

Markers are displayed at the end of links.
Because precise marker dimensions are required for path calculations, it is necessary to provide a lot of data.
Hence, it is recommended to only use the default marker `Markers.Arrow` with customizable size as seen below.

<<< @/config/samples/marker.ts

## Modifiers

If absolute control is required, `modifiers` can be used to customize D3 internals.

::: tip
Configuring modifiers is usually not required.
Do not forget to unset predefined callbacks like `pointerdown` and `contextmenu` for `node` if required.
:::

### Drag

<<< @/config/samples/modifiers/drag.ts

### Links

<<< @/config/samples/modifiers/links.ts

### Nodes

<<< @/config/samples/modifiers/nodes.ts

### Simulation

<<< @/config/samples/modifiers/simulation.ts

### Zoom

<<< @/config/samples/modifiers/zoom.ts

## Node Radius

The radius of nodes is used for their visualization as well as the underlying simulation.
It can be configured using the `nodeRadius` property of the config.

<<< @/config/samples/static-node-radius.ts

It is also possible to use a function for dynamic node radii.

<<< @/config/samples/dynamic-node-radius.ts

## Position Initialization

When a `GraphController` is created, it initializes the positions of nodes that do not have their coordinates set.
The behavior of this initialization can be customized by providing a `PositionInitializer`.
A `PositionInitializer` is a function that receives a `GraphNode` as well as the width and height of a graph and returns two coordinates.
This library provides two `PositionInitializer`s out of the box.

By default, `PositionInitializers.Centered` is used.
Alternatively, `PositionInitializers.Randomized` or custom implementations can be used.

<<< @/config/samples/position-initializers.ts

## Resizing

Graphs can be resized to fit their container.
This can either happen manually by calling a `GraphController`'s `resize` method or automatically by setting `autoResize` to `true`.

<<< @/config/samples/resizing.ts

## Simulation

The interactivity of the graph is driven by a d3 simulation.
Its forces and behavior can be configured for precise control.

### Alphas

Alpha values determine the _heat_ or _activity_ of a simulation.
The higher the value, the stronger the simulation will react.
After certain actions, the simulations needs to be restarted.
The alpha values for those restarts can be configured.
Reference the default configuration below for the available options.

<<< @/config/samples/alphas.ts

::: tip
`simulation.alphas.focus.acquire` and `simulation.alphas.focus.release` receive the (un-)focused node as a parameter.
`simulation.alphas.resize` can either be a static `number` or a function receiving a `ResizeContext` as its parameter.
:::

### Forces

Forces can be customized or disabled as required.
Some forces provide additional customizability.
Reference the configuration below, which matches the default values.

::: tip
Settings `simulation.forces.collision.radiusMultiplier` to a higher value can drastically reduce the number of intersecting edges.
:::

All `strength` properties can also be functions that receive the subject of the force as a parameter for individual strength.
Except `forces.link`, the subject is always a `GraphNode` (or the custom type used).

<<< @/config/samples/forces.ts

### Link Length

Link length is used to determine the length of links for the simulation.
Similar to node radii, link length can be configured on a per-link basis.
Once again, custom link types can be used to provide the required data.

<<< @/config/samples/link-length.ts

## Zoom

For the zooming functionality, the initial value as well as its boundaries can be configured as seen below.

::: warning
Currently, there's no validation of the values.
The `min` value must be larger than 0 and the initial value must be withing the range `[min, max]`.
:::

<<< @/config/samples/zoom.ts
