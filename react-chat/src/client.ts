import io from 'socket.io-client'
import socketio from '@feathersjs/socketio-client'
import { createClient } from 'feathers-chat'

export * from 'feathers-chat'

const connection = socketio(io('http://localhost:3030'))

export const client = createClient(connection)
