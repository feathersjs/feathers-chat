// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient, { AuthenticationClient } from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { messageClient } from './services/messages/messages.shared'
export type { Message, MessageData, MessageQuery, MessagePatch } from './services/messages/messages.shared'

import { userClient } from './services/users/users.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/users/users.shared'

import { createClient as createAuthClient, LoginRequiredError } from '@featherscloud/auth'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

const auth = createAuthClient({
  appId: 'did:key:z6Mksc9d7DyrKFpyNcZHUy5G78vGFaFwdAuzJSBd9HHM9Msk',
  tokenUrl: 'http://localhost:8787/token',
})

class CloudAuthClient extends AuthenticationClient {
  async getAccessToken() {
    try {
      const token = await auth.getAccessToken()
      return token
    } catch (error: unknown) {
      if (error instanceof LoginRequiredError) {
        window.location.href = await auth.getLoginUrl(error)
      }

      throw error
    }
  }
}

/**
 * Returns a typed client for the feathers-chat app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient({
    Authentication: CloudAuthClient,
    ...authenticationOptions
  }))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(messageClient)
  return client
}
