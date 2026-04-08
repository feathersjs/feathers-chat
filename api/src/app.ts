import { feathers } from 'feathers'
import type { ClientServices } from 'feathers/client'
import type { HookContext as FeathersHookContext, Application as FeathersApplication } from 'feathers'
import { MessageService } from './services/messages.js'
import { SseService } from './services/sse.js'

export type Services = {
  messages: MessageService
  sse: SseService
}

export type Configuration = {}

export type Application = FeathersApplication<Services, Configuration>

export type HookContext = FeathersHookContext<Application>

const app: Application = feathers<Services, Configuration>()

export type Client = FeathersApplication<ClientServices<Services, unknown>>

app.use('sse', new SseService())
app.use('messages', new MessageService())

// On a real-time connection, add the connection to the appropriate channel
app.on('connection', (connection) => {
  if (connection.user) {
    app.channel('authenticated').join(connection)
  } else {
    app.channel('anonymous').join(connection)
  }
})

// Only publish events to authenticated users
app.publish(() => app.channel('authenticated'))

export { app }
