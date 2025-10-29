'use client'

import { Stream } from '@yeger/streams/sync'
import { scaleOrdinal } from 'd3-scale'
import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import {
  Background,
  Controls,
  getNodesBounds,
  getViewportForBounds,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from 'reactflow'
import type { ReactFlowInstance } from 'reactflow'

import 'reactflow/dist/style.css'
import {
  TASK_WIDTH_VAR,
  convertGraph,
  getTaskColorVar,
} from '../lib/flow'
import type { FlowNode } from '../lib/flow'
import type { TurboGraph } from '../lib/turbo'
import { Task } from './Task'
import { useFilterInput } from '../lib/parameters'

export interface Props {
  children?: ReactNode
  graph: TurboGraph
  tasks: string[]
}

const nodeTypes = {
  task: Task,
}

export function FlowGraph({ children, graph, tasks }: Props) {
  const { flowGraph, taskCssVars } = useMemo(() => {
    const flowGraph = convertGraph(graph)
    const getColor = scaleOrdinal(['#FF1E56', '#0196FF', '#CD3678', '#8657A7', '#3F79D5', '#22c55e']).domain(tasks)
    const taskColors = Stream.from(tasks).toRecord(
      (task) => getTaskColorVar(task),
      (task) => getColor(task),
    )
    const taskSize: Record<string, string> = {
      [TASK_WIDTH_VAR]: `${flowGraph.sizeConfig.width}px`,
    }
    const taskCssVars = { ...taskColors, ...taskSize }
    return {
      flowGraph,
      taskCssVars,
    }
  }, [graph, tasks])

  const [, setFilter] = useFilterInput()

  const onNodeClicked = (_: unknown, { data }: { data: FlowNode }) => {
    setFilter(data.packageName)
  }

  return (
    <ReactFlow
      nodes={flowGraph.nodes}
      edges={flowGraph.edges}
      nodeTypes={nodeTypes}
      minZoom={0.1}
      style={taskCssVars}
      noWheelClassName="nowheel"
      noDragClassName="nodrag"
      noPanClassName="nodrag"
      zoomOnScroll
      zoomOnPinch
      panOnScroll={false}
      edgesFocusable={false}
      edgesUpdatable={false}
      nodesDraggable={false}
      nodesConnectable={false}
      onNodeContextMenu={onNodeClicked}
      onNodeDoubleClick={onNodeClicked}
      zoomOnDoubleClick={false}
      onlyRenderVisibleElements
    >
      {children}
      <Background />

      <MiniMap
        nodeColor={({ data }: { data: FlowNode }) =>
          `var(${getTaskColorVar(data.task)})`}
        nodeStrokeColor="#000000"
      />
      <ViewFitter graph={graph} />
    </ReactFlow>
  )
}

function ViewFitter({ graph }: { graph: TurboGraph }) {
  const reactFlow = useReactFlow()
  useEffect(() => {
    const timeout = setTimeout(() => fitViewWithOffset(reactFlow), 500)
    return () => {
      clearTimeout(timeout)
    }
  }, [reactFlow, graph])

  return <Controls position="top-right" showInteractive={false} onFitView={() => fitViewWithOffset(reactFlow)} />
}

function fitViewWithOffset(reactFlow: ReactFlowInstance) {
  const bounds = getNodesBounds(reactFlow.getNodes())
  const containerSize = document.querySelector('.react-flow__renderer')?.getBoundingClientRect()
  if (!containerSize) {
    return
  }
  const offset = document.getElementById('sidebar')?.getBoundingClientRect().width ?? 0
  const { x, y, zoom } = getViewportForBounds(
    bounds,
    containerSize!.width - offset,
    containerSize!.height,
    0.1,
    2,
    0.1,
  )
  reactFlow.setViewport({ x: x + offset, y, zoom }, { duration: 200 })
}
