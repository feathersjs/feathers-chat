import { useEffect, useState } from "react"
import { client, User } from "../client"
import { CreateMessage } from "./CreateMessage"
import { MessageList } from "./MessageList"

export const Chat = () => {
  const [users, setUsers] = useState<User[]>([])
  const logout = async () => {
    await client.logout()
  }

  useEffect(() => {
    const getUsers = async () => {
      const page = await client.service('users').find()

      setUsers(page.data)
    }

    getUsers()
  }, [])

  return <div className="drawer drawer-mobile"><input id="drawer-left" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content flex flex-col">
      <div className="navbar w-full">
        <div className="navbar-start">
          <label htmlFor="drawer-left" className="btn btn-square btn-ghost lg:hidden drawer-button">
            <i className="i-feather-menu text-lg"></i>
          </label>
        </div>
        <div className="navbar-center flex flex-col">
          <p>Feathers Chat</p>
          <label htmlFor="drawer-right" className="text-xs cursor-pointer">
            <span className="online-count">{users.length}</span> User(s)
          </label>
        </div>
        <div className="navbar-end">
          <div className="tooltip tooltip-left" data-tip="Logout">
          <button type="button" id="logout" className="btn btn-ghost" onClick={logout}><i className="i-feather-log-out text-lg"></i></button>
        </div>
        </div>
      </div>
      <MessageList />
      <div className="form-control w-full py-2 px-3">
        <CreateMessage />
      </div>
    </div>
    <div className="drawer-side"><label htmlFor="drawer-left" className="drawer-overlay"></label>
      <ul className="menu user-list compact p-2 overflow-y-auto w-60 bg-base-300 text-base-content">
        <li className="menu-title"><span>Users</span></li>
        {users.map(user => <li className="user" key={user.id}>
          <a>
            <div className="avatar indicator">
              <div className="w-6 rounded"><img src={user.avatar} alt={user.email} /></div>
            </div><span>{user.email}</span>
          </a>
        </li>)}
      </ul>
    </div>
  </div>
}
