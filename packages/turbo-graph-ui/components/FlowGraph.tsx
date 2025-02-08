'use client'

import { Stream } from '@yeger/streams'
import { scaleOrdinal } from 'd3-scale'
import { schemeSet3 } from 'd3-scale-chromatic'
import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  useReactFlow,
} from 'reactflow'

import 'reactflow/dist/style.css'
import {
  TASK_HEIGHT_VAR,
  TASK_WIDTH_VAR,
  convertGraph,
  getTaskColorVar,
} from '../lib/flow'
import type { FlowNode } from '../lib/flow'
import type { TurboGraph } from '../lib/turbo'
import { useGraphSettings } from '../lib/utils'

export interface Props {
  children: ReactNode
  graph: TurboGraph
  uniqueTasks: Set<string>
}

interface TaskProps {
  data: FlowNode
}

function Task({ data }: TaskProps) {
  const { task, package: workspace, isTerminal, isOrigin } = data
  return (
    <div className="flex flex-col">
      {isOrigin
        ? null
        : (
            <Handle type="target" position={Position.Top} isConnectable={false} />
          )}
      <div
        className="flex flex-col rounded p-4"
        style={{
          width: `var(${TASK_WIDTH_VAR})`,
          height: `var(${TASK_HEIGHT_VAR})`,
          backgroundColor: `var(${getTaskColorVar(task)})`,
        }}
      >
        <div className="font-bold text-neutral-800">{task}</div>
        <div className="text-right text-neutral-800">{workspace}</div>
      </div>
      {isTerminal
        ? null
        : (
            <Handle
              type="source"
              position={Position.Bottom}
              isConnectable={false}
            />
          )}
    </div>
  )
}

const nodeTypes = {
  task: Task,
}

export function FlowGraph({ children, graph, uniqueTasks }: Props) {
  const { flowGraph, taskCssVars } = useMemo(() => {
    const flowGraph = convertGraph(graph)
    const getColor = scaleOrdinal(schemeSet3).domain(uniqueTasks)
    const taskColors = Stream.from(uniqueTasks).toRecord(
      (task) => getTaskColorVar(task),
      (task) => getColor(task),
    )
    const taskSize: Record<string, string> = {
      [TASK_WIDTH_VAR]: `${flowGraph.sizeConfig.width}px`,
      [TASK_HEIGHT_VAR]: `${flowGraph.sizeConfig.height}px`,
    }
    const taskCssVars = { ...taskColors, ...taskSize }
    return {
      flowGraph,
      taskCssVars,
    }
  }, [graph, uniqueTasks])

  const { setParameter } = useGraphSettings()

  const onNodeClicked = (_: unknown, { data }: { data: FlowNode }) => {
    setParameter('filter', data.package)
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
