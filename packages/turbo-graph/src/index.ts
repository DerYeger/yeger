import { createServer } from 'node:http'
import path from 'node:path'

import { cac } from 'cac'
import next from 'next'
import open from 'open'
import c from 'picocolors'

interface Options {
  o: boolean
  open: boolean
  p: number
  port: number
}

const source = path.dirname(require.resolve('@yeger/turbo-graph-ui'))

const defaultPort = 29312

const cli = cac('turbo-graph')
  .option('-o, --open', 'Open the visualizer in the default browser.')
  .option('-p, --port <port>', 'Port of the visualizer.', {
    default: defaultPort,
  })
  .help()

cli.command('').action(startServer)

cli.parse()

function startServer(options: Options) {
  const app = next({ dev: false, dir: source })
  const handle = app.getRequestHandler()

  createServer(handle).listen(options.port)

  const url = `http://localhost:${options.port}`

  // eslint-disable-next-line no-console
  console.log(`${c.green('turbo-graph:')} Listening on ${c.cyan(url)}`)

  if (options.open) {
    open(url)
  }
}
