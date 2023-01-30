import { client, Message } from "../client"
import { useEffect, useRef, useState } from "react"

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    dateStyle: 'medium'
  }).format(new Date(timestamp))

export const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const findMessages = async () => {
      const messages = await client.service('messages').find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      // We want to show the newest message last
      setMessages(messages.data.reverse())
    }
    const updateMessages = (message: Message) => {
      setMessages(messages => [...messages, message])
    }
    
    client.service('messages').on('created', updateMessages)

    findMessages()

    // This will remove the event listener when the component unmounts
    return () => {
      client.service('messages').removeListener('created', updateMessages)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    (messagesEndRef.current as any)?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return <div id="chat" className="h-full overflow-y-auto px-3">
    {messages.map(message => <div className="chat chat-start py-2" key={message.id}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img src={message.user?.avatar} />
        </div>
      </div>
      <div className="chat-header pb-1">
        {message.user?.email}
        <time className="text-xs opacity-50">{formatDate(message.createdAt)}</time>
      </div>
      <div className="chat-bubble">{message.text}</div>
    </div>)}
    <div ref={messagesEndRef} />
  </div>
}