import type { Params } from '@feathersjs/feathers'
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'
import type { OAuthProfile } from '@feathersjs/authentication-oauth'
import type { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

class GitHubStrategy extends OAuthStrategy {
  async getEntityData(profile: OAuthProfile, existing: any, params: Params) {
    const baseData = await super.getEntityData(profile, existing, params)

    return {
      ...baseData,
      // The GitHub profile image
      avatar: profile.avatar_url,
      // The user email address (if available)
      email: profile.email || profile.login
    }
  }
}

class AppleStrategy extends OAuthStrategy {
  async getProfile (data: any, params: any) {
    console.log(data)
    return data.jwt.id_token.payload
  }

  async getEntityQuery(profile: OAuthProfile, _params: Params): Promise<{ [x: string]: any }> {
    return {
      email: profile.email
    }
  }

  async getEntityData(profile: OAuthProfile, _existingEntity: any, _params: Params): Promise<{ [x: string]: any }> {
    return {
      email: profile.email,
      avatar: 'https://www.gravatar.com/avatar/d5863c19eb620306b3599591ae73970c0af54f5f5f66340823b4d9554dea1584'
    }
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('github', new GitHubStrategy())
  authentication.register('apple', new AppleStrategy())

  app.use('authentication', authentication)
  app.configure(oauth())
}
