import type { Params } from '@feathersjs/feathers'
import { AuthenticationParams, AuthenticationRequest, AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { CloudAuthUser, createVerifier } from '@featherscloud/auth'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'
import type { OAuthProfile } from '@feathersjs/authentication-oauth'
import type { Application } from './declarations'
import { NotAuthenticated } from '@feathersjs/errors'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

const verifier = createVerifier({
  appId: 'did:key:z6Mksc9d7DyrKFpyNcZHUy5G78vGFaFwdAuzJSBd9HHM9Msk',
})

class CloudAuthStrategy extends JWTStrategy {
  async findUser (cloudUser: CloudAuthUser, params: AuthenticationParams) {
    const result = await this.entityService.find({
      ...params,
      query: {
        email: cloudUser.email
      }
    })
    const [user] = Array.isArray(result) ? result : result.data;

    if (!user) {
      return this.createUser(cloudUser, params);
    }

    return user
  }

  async createUser (user: CloudAuthUser, params: AuthenticationParams) {
    const entity = await this.entityService.create({
      email: user.email
    }, params);
    
    return entity;
  }

  async authenticate(authentication: AuthenticationRequest, params: AuthenticationParams) {
    const { accessToken } = authentication;
    const { entity } = this.configuration;
    if (!accessToken) {
        throw new NotAuthenticated('No access token');
    }
    const verified = await verifier.verify(accessToken);
    const result = {
        accessToken,
        authentication: {
            strategy: this.name || 'jwt',
            accessToken,
            ...verified
        }
    };

    if (entity === null || verified.user === null) {
        return result;
    }
    
    return {
        ...result,
        [entity]: await this.findUser(verified.user, params)
    };
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

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new CloudAuthStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('github', new GitHubStrategy())

  app.use('authentication', authentication)
  app.configure(oauth())
}
