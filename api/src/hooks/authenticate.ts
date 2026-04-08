import type { HookContext, NextFunction } from 'feathers'
import { NotAuthenticated } from 'feathers/errors'
import { createVerifier } from 'talon-auth'

const verifier = createVerifier({ appId: 'did:key:z6MknavTx2wpQQVh8ENZAnbCJ2SbTftJVjMHJ8CUDFStk7Lf' })

export async function authenticate(context: HookContext, next: NextFunction) {
  if (context.params?.request) {
    const authorization = context.params?.request.headers.get('authorization')

    try {
      const { user } = await verifier.verifyHeader(authorization!)
      context.params = {
        ...context.params,
        user
      }
    } catch {
      throw new NotAuthenticated('Invalid or missing access token')
    }
  }

  await next()
}
