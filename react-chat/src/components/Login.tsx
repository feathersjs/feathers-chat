import { useState } from 'react'
import { client } from '../client'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<Error|null>(null)
  const handleLogin = async () => {
    try {
      await client.authenticate({
        strategy: 'local',
        email,
        password
      })
    } catch (error: any) {
      setError(error)
    }
  }
  const handleSignup = async () => {
    await client.service('users').create({
      email,
      password
    })
    await handleLogin()
  }

  return <div className="login flex min-h-screen bg-neutral justify-center items-center">
    <div className="card w-full max-w-sm bg-base-100 px-4 py-8 shadow-xl">
      <div className="px-4"><i className="h-32 w-32 block mx-auto i-logos-feathersjs invert"></i>
        <h1 className="text-5xl font-bold text-center my-5 bg-clip-text bg-gradient-to-br">
          Feathers Chat
        </h1>
      </div>
      <form className="card-body pt-2" onSubmit={async ev => {
        ev.preventDefault()

        handleLogin()
      }}>
        {error && <div className="alert alert-error justify-start">
          <i className="i-feather-alert-triangle"></i>
          <span className="flex-grow">{error.message}</span>
        </div>}
        <div className="form-control">
          <label htmlFor="email" className="label"><span className="label-text">Email</span></label>
          <input type="text" value={email} onChange={ev => setEmail(ev.target.value)} name="email" placeholder="enter email" className="input input-bordered" />
        </div>
        <div className="form-control mt-0">
          <label htmlFor="password" className="label"><span className="label-text">Password</span></label>
          <input type="password" value={password} onChange={ev => setPassword(ev.target.value)} name="password" placeholder="enter password" className="input input-bordered" />
        </div>
        <div className="form-control mt-6"><button id="login" type="submit" className="btn">Login</button></div>
        <div className="form-control mt-6"><button id="signup" type="button" className="btn" onClick={handleSignup}>Signup</button></div>
        <div className="form-control mt-6"><a href="http://localhost:3030/oauth/github" id="github" className="btn">Login with GitHub</a></div>
      </form>
    </div>
  </div>
}
