import { client, User } from './client'
import { useEffect, useState } from 'react'
import { Login } from './components/Login'
import { Chat } from './components/Chat'

function App() {
  const [user, setUser] = useState<User|null>(null)

  useEffect(() => {
    client.on('login', ({ user }: { user: User }) => setUser(user))
    client.on('logout', () => setUser(null))
    
    const reAuthenticate = async () => {
      try {
        await client.reAuthenticate()
      } catch (error) {
        setUser(null)
      }
    }

    reAuthenticate()
  })

  return user ? <Chat /> : <Login />
}

export default App;
