// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { User, UserData, UserPatch, UserQuery, UserService } from './users.class'

export type { User, UserData, UserPatch, UserQuery }

export type UserClientService = Pick<UserService<Params<UserQuery>>, (typeof userMethods)[number]>

export const userPath = 'users'

export const userMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const userClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(userPath, connection.service(userPath), {
    methods: userMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [userPath]: UserClientService
  }
}
