import * as s from '@yeger/streams/sync'
import { graphStratify, sugiyama, decrossTwoLayer, coordCenter } from 'd3-dag'
import type { Edge, Node } from 'reactflow'

import type { TurboEdge, TurboGraph, TurboNode } from './turbo'

export type FlowGraph = ReturnType<typeof convertGraph>

export interface SizeConfig {
  width: number
  height: number
  horizontalSpacing: number
  verticalSpacing: number
}

export function convertGraph(graph: TurboGraph) {
  const hierarchy = createHierarchy(graph)
  const longestLine = getLongestLineLength(graph)
  const sizeConfig = createSizeConfig(longestLine)
  return createFlowGraph(hierarchy, graph.edges, sizeConfig)
}

function createHierarchy(graph: TurboGraph) {
  const stratify = graphStratify()
  return stratify(
    graph.nodes.map((node) => ({
      ...node,
      id: node.id,
      parentIds: graph.edges.filter((edge) => edge.target === node.id).map(({ source }) => source),
    })),
  )
}
function getLongestLineLength({ nodes }: TurboGraph) {
  const length = Math.max(
    ...nodes.flatMap(({ task, packageName }) => [task.length, packageName.length]),
  )
  if (length < 0) {
    return 1
  }
  return length
}

function createSizeConfig(longestLine: number): SizeConfig {
  return {
    width: Math.max(512, 64 + longestLine * 10),
    height: 262,
    horizontalSpacing: 128,
    verticalSpacing: 128,
  }
}

export interface FlowNode extends TurboNode {
  isOrigin: boolean
  isTerminal: boolean
}

function createFlowGraph(
  hierarchy: ReturnType<typeof createHierarchy>,
  turboEdges: TurboEdge[],
  sizeConfig: SizeConfig,
) {
  const { width, height, horizontalSpacing, verticalSpacing } = sizeConfig
  const layout = sugiyama()
    .nodeSize([width + horizontalSpacing, height + verticalSpacing])
    .decross(decrossTwoLayer())
    .coord(coordCenter())
  const layoutResult = layout(hierarchy)
  const nodes = s.toArray(
    s.pipe(
      hierarchy.nodes(),
      s.map(
        (node): Node<FlowNode> => ({
          id: node.data.id,
          data: {
            ...node.data,
            isTerminal: node.nchildren() === 0,
            isOrigin: node.nparents() === 0,
          },
          focusable: false,
          position: { x: node.x, y: node.y },
          type: 'task',
        }),
      ),
    ),
  )
  const edges = turboEdges.map<Edge<TurboEdge>>((edge) => ({
    id: `edge-${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    animated: false,
    style: {
      stroke: `var(${getTaskColorVar(edge.targetTask)})`,
      width: 4,
    },
  }))
  return { nodes, edges, sizeConfig, layoutResult }
}

function normalizeTaskName(task: string) {
  return task.replaceAll(':', '-').replaceAll('#', '-').replaceAll('/', '-').replaceAll('@', '-')
}

export function getTaskColorVar(task: string) {
  return `--task-color-${normalizeTaskName(task)}`
}

export const TASK_WIDTH_VAR = '--task-width'
export const TASK_HEIGHT_VAR = '--task-height'
