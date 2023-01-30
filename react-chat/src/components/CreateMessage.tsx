import { useState } from "react"
import { client } from "../client"

export const CreateMessage = () => {
  const [text, setText] = useState('')
  const handleSubmit = async () => {
    await client.service('messages').create({ text })
    setText('')
  }

  return <form className="input-group overflow-hidden" id="send-message" onSubmit={ev => {
    ev.preventDefault()
    handleSubmit()
  }}>
    <input name="text" type="text" value={text} onChange={ev => setText(ev.target.value)}
      placeholder="Compose message" className="input input-bordered w-full" />
    <button type="submit" className="btn">Send</button>
  </form>
}
