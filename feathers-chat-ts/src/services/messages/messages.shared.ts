// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client.js'
import type { Message, MessageData, MessagePatch, MessageQuery, MessageService } from './messages.class.js'

export type { Message, MessageData, MessagePatch, MessageQuery }

export type MessageClientService = Pick<MessageService<Params<MessageQuery>>, (typeof messageMethods)[number]>

export const messagePath = 'messages'

export const messageMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const messageClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(messagePath, connection.service(messagePath), {
    methods: messageMethods
  })
}

// Add this service to the client service type index
declare module '../../client.js' {
  interface ServiceTypes {
    [messagePath]: MessageClientService
  }
}
