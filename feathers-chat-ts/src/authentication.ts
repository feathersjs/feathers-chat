import { AuthenticationBaseStrategy, AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { createVerifier } from 'talon-auth'
import type { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

const appId = 'did:key:z6Mkqo9vCYS8n5hFYjPX4YvDTBstj4dw6VoQY1ggrDJhVmxc'

class TalonStrategy extends AuthenticationBaseStrategy {
  verifier = createVerifier({ appId })

  async authenticate(authentication: any, params: any) {
    const { accessToken } = authentication
    const { user: talonUser } = await this.verifier.verify(accessToken)
    const usersService = this.app!.service('users')

    if (!talonUser) {
      throw new Error('Talon user not found')
    }

    const { email } = talonUser
    // Find or create the user by email
    const users = await usersService.find({
      query: { email },
      paginate: false
    })
    const user = users?.length > 0 ? users[0] : await usersService.create({ email })

    return {
      authentication: { strategy: 'talon' },
      user
    }
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('talon', new TalonStrategy())

  app.use('authentication', authentication)
}
