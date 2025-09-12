import type { NextRequest } from 'next/server'
import { findRootTurboConfig } from '../../../lib/turbo'
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// API Route to execute turborepo tasks and stream logs via Server-Sent Events (text/event-stream)
async function buildResponseFromArgs(tasks: string[], filter: string | undefined, signal: AbortSignal, options: { force?: boolean }) {
  const { dir } = await findRootTurboConfig()
  const args: string[] = ['run', ...tasks]
  if (filter) {
    for (const part of filter.split(',')) {
      const trimmed = part.trim()
      if (trimmed) {
        args.push(`--filter=${trimmed}`)
      }
    }
  }
  args.push('--ui=stream')
  if (options?.force) {
    args.push('--force')
  }
  const turboBin = `node_modules${path.sep}.bin${path.sep}turbo`
  const child = spawn(turboBin, args, { cwd: dir, env: { ...process.env, CI: 'true' } })

  const encoder = new TextEncoder()
  const { readable, writable } = new TransformStream<Uint8Array>()
  const writer = writable.getWriter()
  let isClosed = false
  let heartbeat: NodeJS.Timeout | null = null
  const listeners: Array<() => void> = []
  async function write(text: string) {
    if (isClosed) {
      return
    }
    try {
      await writer.write(encoder.encode(text))
    } catch { }
  }
  const safe = {
    async send(kind: string, data: string) {
      await write(`event: ${kind}\n` + `data: ${data}\n\n`)
    },
    async finish(code: number | null) {
      if (isClosed) {
        return
      }
      isClosed = true
      if (heartbeat) {
        clearInterval(heartbeat)
      }
      try {
        await write(`event: end\n` + `data: ${String(code ?? 0)}\n\n`)
        // trailing comment to encourage final flush across proxies
        await write(`: end\n\n`)
      } finally {
        // Slight delay to ensure the end event is flushed before close
        setTimeout(async () => {
          try {
            await writer.close()
          } catch { }
          for (const off of listeners) {
            off()
          }
        }, 10)
      }
    },
  }

    ; (async () => {
      try {
        await write(`: ${' '.repeat(2048)}\n\n`)
        await write('retry: 10000\n\n')
        await safe.send('start', JSON.stringify({ args }))
        heartbeat = setInterval(() => {
          void safe.send('heartbeat', String(Date.now()))
        }, 15000)

        child.stdout.setEncoding('utf8')
        child.stderr.setEncoding('utf8')
        // If the client disconnects (aborts the request), terminate the child and finish the stream
        if (signal) {
          const onAbort = () => {
            try {
              child.kill('SIGTERM')
            } catch { }
            void safe.finish(null)
          }
          signal.addEventListener('abort', onAbort)
          listeners.push(() => signal.removeEventListener('abort', onAbort))
        }
        const onStdout = (chunk: string) => {
          if (isClosed) {
            return
          }
          chunk
            .split(/\r?\n/)
            .filter(Boolean)
            .forEach((line) => {
              void safe.send('log', line)
            })
        }
        const onStderr = (chunk: string) => {
          if (isClosed) {
            return
          }
          chunk
            .split(/\r?\n/)
            .filter(Boolean)
            .forEach((line) => {
              void safe.send('stderr', line)
            })
        }
        const onClose = (code: number | null) => {
          void safe.finish(code)
        }
        const onError = (err: Error) => {
          void safe.send('stderr', err.message)
        }
        child.stdout.on('data', onStdout)
        child.stderr.on('data', onStderr)
        child.on('close', onClose)
        child.on('error', onError)
        listeners.push(
          () => child.stdout.off('data', onStdout),
          () => child.stderr.off('data', onStderr),
          () => child.off('close', onClose),
          () => child.off('error', onError),
        )
      } catch (err) {
        await safe.send('error', (err as Error)?.message ?? 'stream error')
        await safe.finish(1)
      }
    })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  // Accept both comma-separated and repeated parameters
  const tasksParam = url.searchParams.getAll('tasks')
  const tasks: string[] = []
  if (tasksParam.length > 0) {
    for (const t of tasksParam) {
      tasks.push(...t.split(',').map((s) => s.trim()).filter(Boolean))
    }
  }
  const filter = url.searchParams.get('filter') ?? undefined
  const force = ['1', 'true', 'yes'].includes((url.searchParams.get('force') ?? '').toLowerCase())
  if (tasks.length === 0) {
    return new Response('Missing tasks', { status: 400 })
  }
  return buildResponseFromArgs(tasks, filter, req.signal, { force })
}
