// oxlint-disable no-console
import { randomBytes } from 'node:crypto'
import { createServer } from 'node:http'
import path from 'node:path'
import process from 'node:process'

import { cac } from 'cac'
import next from 'next'
import open from 'open'
import c from 'picocolors'

interface Options {
  open?: boolean
  port: number
  filter?: string
}

function run() {
  const source = path.dirname(import.meta.resolve('@yeger/turbo-graph-ui').replace('file://', ''))
  const hostname = 'localhost'
  const defaultPort = 29312

  const cli = cac('turbo-graph')
    .option('-o, --open', 'Open the visualizer in the default browser.')
    .option('-p, --port <port>', 'Port of the visualizer.', {
      default: defaultPort,
    })
    .option('-f, --filter <filter>', 'Apply a filter to the visualization.')
    .help()

  cli.command('[...tasks]', 'Visualize the specified tasks').action(startServer)

  cli.parse()

  function startServer(tasks: string[], options: Options) {
    const authCode = randomBytes(18).toString('base64url')
    // Must be set before the Next.js server starts, as its route handlers read it at request time
    process.env.TURBO_GRAPH_AUTH_CODE = authCode

    const app = next({ dev: false, dir: source, hostname, port: options.port })
    const handle = app.getRequestHandler()

    void app.prepare().then(() => {
      createServer(handle)
        .once('error', (err) => {
          console.error(err)
          process.exit(1)
        })
        .listen(options.port, hostname, () => {
          const url = `http://${hostname}:${options.port}`
          const params = new URLSearchParams({ code: authCode })
          console.log(`${c.green('turbo-graph:')} Listening on ${c.cyan(url)}`)
          console.log(`${c.green('turbo-graph:')} Auth code: ${c.bold(authCode)}`)
          console.log(`${c.green('turbo-graph:')} Open ${c.cyan(`${url}/?${params}`)}`)
          if (options.open) {
            for (const task of tasks) {
              params.append('task', task)
            }
            if (options.filter) {
              params.set('filter', options.filter)
            }
            void open(`${url}/?${params}`)
          } else if (tasks.length > 0 || options.filter) {
            console.log(
              `${c.yellow('turbo-graph:')} Use ${c.cyan(
                '--open',
              )} to open the visualizer in the default browser with the provided tasks and filter.`,
            )
          }
        })
    })
  }
}

run()
