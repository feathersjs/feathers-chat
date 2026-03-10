import { AuthenticationBaseStrategy, AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { createVerifier } from 'talon-auth'
import type { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

const appId = 'did:key:z6MknavTx2wpQQVh8ENZAnbCJ2SbTftJVjMHJ8CUDFStk7Lf'

class TalonStrategy extends AuthenticationBaseStrategy {
  verifier = createVerifier({ appId })

  async authenticate(authentication: any, params: any) {
    const { accessToken } = authentication
    const { user: talonUser } = await this.verifier.verify(accessToken)
    const usersService = this.app!.service('users')

    // Find or create the user by email
    const users = await usersService.find({
      query: { email: talonUser!.email },
      paginate: false
    })

    let user
    if ((users as any[]).length > 0) {
      user = (users as any[])[0]
    } else {
      user = await usersService.create({
        email: talonUser!.email,
        avatar: `https://s.gravatar.com/avatar/${talonUser!.id}?s=60&d=mp`
      })
    }

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
