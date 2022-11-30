import { PositionInitializers, defineGraphConfig } from 'd3-graph-controller'

const config = defineGraphConfig({
  positionInitializer: PositionInitializers.Randomized,
})
