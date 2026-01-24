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

async function run() {
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
    const app = next({ dev: false, dir: source, port: options.port })
    const handle = app.getRequestHandler()

    void app.prepare().then(() => {
      createServer(handle)
        .once('error', (err) => {
          console.error(err)
          process.exit(1)
        })
        .listen(options.port, () => {
          const url = `http://${hostname}:${options.port}`
          console.log(`${c.green('turbo-graph:')} Listening on ${c.cyan(url)}`)
          if (options.open) {
            let urlToOpen = `${url}/?`
            if (tasks.length > 0) {
              urlToOpen = `${urlToOpen}${tasks.map((task) => `task=${task}`).join('&')}`
            }
            if (options.filter) {
              if (tasks.length > 0) {
                urlToOpen = `${urlToOpen}&`
              }
              urlToOpen = `${urlToOpen}filter=${options.filter}`
            }
            void open(urlToOpen)
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

void run()
