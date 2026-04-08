import { createServer } from 'node:http'
import { createHandler } from 'feathers/http'
import { toNodeHandler } from 'feathers/http/node'
import { app } from './app.js'

const PORT = process.env.PORT || 3030
const handler = createHandler(app)
const server = createServer(toNodeHandler(handler))

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// Call app.setup to initialize all services
await app.setup(server)
