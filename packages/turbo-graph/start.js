const { createServer } = require('http')

// eslint-disable-next-line import/order
const next = require('next')

const app = next({ dev: false, dir: __dirname })
const handle = app.getRequestHandler()

const port = 29312

createServer(handle).listen(port)

const open = require('open')

const url = `http://localhost:${port}`

// eslint-disable-next-line no-console
console.log(`Listening on ${url}`)

open(url)
