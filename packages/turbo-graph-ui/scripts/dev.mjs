// oxlint-disable no-console
/**
 * Starts the Next.js dev server bound to `localhost` with a random auth code.
 * `next dev` would otherwise listen on all interfaces, and a fixed code could be guessed via DNS rebinding.
 */
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createRequire } from 'node:module'
import process from 'node:process'

const hostname = 'localhost'
const port = process.env.PORT ?? '3000'
const authCode = process.env.TURBO_GRAPH_AUTH_CODE || randomBytes(18).toString('base64url')

const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next')
const child = spawn(process.execPath, [nextBin, 'dev', '-H', hostname, '-p', port], {
  stdio: 'inherit',
  env: { ...process.env, TURBO_GRAPH_AUTH_CODE: authCode },
})

const params = new URLSearchParams({ code: authCode })
console.log(`turbo-graph-ui: Open http://${hostname}:${port}/?${params}`)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}
child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})
