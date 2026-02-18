'use client'

import { Icon } from '@iconify/react'
import { Wrench, Play, TestTube, Shield, Bug, Box } from 'lucide-react'
import { Handle, Position } from 'reactflow'

import type { FlowNode } from '../lib/flow'
import { TASK_WIDTH_VAR, TASK_HEIGHT_VAR, getTaskColorVar } from '../lib/flow'
import { useTaskRun } from '../lib/useRunQueries'
import { LogOutput } from './LogOutput'

export interface TaskProps {
  data: FlowNode
}

export function Task({ data }: TaskProps) {
  const { task, packageName, packageDir, framework, isTerminal, isOrigin } = data
  const taskId = data.id
  const state = useTaskRun(taskId)
  return (
    <div className="flex flex-col">
      {isOrigin ? null : <Handle type="target" position={Position.Top} isConnectable={false} />}
      <div
        className="task-node rounded-lg border border-neutral-400/20 bg-neutral-900 p-4 font-mono text-sm flex flex-col gap-2"
        style={{
          width: `var(${TASK_WIDTH_VAR})`,
          height: `var(${TASK_HEIGHT_VAR})`,
        }}
      >
        {/* Header section */}
        <div className="flex items-center gap-3">
          <div className="text-md flex size-6 items-center justify-center text-lg font-bold text-white">
            <PackageIcon framework={framework} packageName={packageName} />
          </div>
          <div>
            <div className="font-medium text-white">{packageName}</div>
            <div className="text-xs text-gray-400">{packageDir}</div>
          </div>
        </div>

        {/* Command section */}
        <div
          className="rounded border border-solid bg-black p-3"
          style={{ borderColor: `var(${getTaskColorVar(task)})` }}
        >
          <div className="flex items-center gap-3">
            <div className="text-white">
              <TaskIcon task={task} />
            </div>
            <span className="font-medium text-white">{task}</span>
          </div>
        </div>
        <div className="h-32 rounded-md border border-white/10 bg-black/20">
          <LogOutput
            items={state.lines.map((l) => ({ id: l.id, text: l.raw, kind: l.kind }))}
            containerClassName="h-full overflow-x-hidden overflow-y-auto bg-neutral-950 p-2 [mask-image:linear-gradient(to_bottom,transparent,black_0.5rem,black_calc(100%-0.5rem),transparent)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
          />
        </div>
      </div>
      {isTerminal ? null : (
        <Handle type="source" position={Position.Bottom} isConnectable={false} />
      )}
    </div>
  )
}

function PackageIcon({ framework, packageName }: Pick<FlowNode, 'framework' | 'packageName'>) {
  if (!framework) {
    return getPackageNameShortcut(packageName)
  }
  if (framework === 'vite') {
    return <Icon icon="logos:vitejs" className="size-6" />
  }
  if (framework === 'nextjs') {
    return <Icon icon="logos:nextjs-icon" className="size-6" />
  }
  if (framework === 'nuxtjs') {
    return <Icon icon="logos:nuxt-icon" className="size-6" />
  }
  return getPackageNameShortcut(packageName)
}
function TaskIcon({ task }: Pick<FlowNode, 'task'>) {
  const normalizedTask = task.toLocaleLowerCase()
  if (/build|gen/.test(normalizedTask)) {
    return <Wrench className="size-4" />
  }
  if (/dev|preview/.test(normalizedTask)) {
    return <Play className="size-4" />
  }
  if (/test|e2e|unit/.test(normalizedTask)) {
    return <TestTube className="size-4" />
  }
  if (/check|type|tsc/.test(normalizedTask)) {
    return <Shield className="size-4" />
  }
  if (/lint|fix/.test(normalizedTask)) {
    return <Bug className="size-4" />
  }
  return <Box className="size-4" />
}

function getPackageNameShortcut(packageName: string) {
  const normalizedName = packageName.split('/').at(-1) ?? packageName
  const segments = normalizedName.split('-', 3)
  return segments.map((segment) => segment.at(0)).join('')
}
