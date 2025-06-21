'use client'

import { Stream } from '@yeger/streams'
import { scaleOrdinal } from 'd3-scale'
import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from 'reactflow'

import 'reactflow/dist/style.css'
import {
  TASK_WIDTH_VAR,
  convertGraph,
  getTaskColorVar,
} from '../lib/flow'
import type { FlowNode } from '../lib/flow'
import type { TurboGraph } from '../lib/turbo'
import { useGraphSettings } from '../lib/utils'
import { Task } from './Task'

export interface Props {
  children?: ReactNode
  graph: TurboGraph
  uniqueTasks: Set<string>
}

const nodeTypes = {
  task: Task,
}

export function FlowGraph({ children, graph, uniqueTasks }: Props) {
  const { flowGraph, taskCssVars } = useMemo(() => {
    const flowGraph = convertGraph(graph)
    const getColor = scaleOrdinal(['#FF1E56', '#0196FF', '#CD3678', '#8657A7', '#3F79D5', '#22c55e']).domain(uniqueTasks)
    const taskColors = Stream.from(uniqueTasks).toRecord(
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
  }, [graph, uniqueTasks])

  const { setParameter } = useGraphSettings()

  const onNodeClicked = (_: unknown, { data }: { data: FlowNode }) => {
    setParameter('filter', data.packageName)
  }

  return (
    <ReactFlow
      nodes={flowGraph.nodes}
      edges={flowGraph.edges}
      nodeTypes={nodeTypes}
      minZoom={0.1}
      style={taskCssVars}
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
      <Controls showInteractive={false} />
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
    const timeout = setTimeout(() => {
      reactFlow.fitView({ duration: 200 })
    }, 200)
    return () => {
      clearTimeout(timeout)
    }
  }, [reactFlow, graph])
  return null
}
