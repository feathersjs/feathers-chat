import { feathers } from 'feathers'
import { fetchClient } from 'feathers/client'
import { getLoginElement } from 'talon-auth'

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers()

client.configure(fetchClient(window.fetch.bind(window), {
  baseUrl: 'http://localhost:3030',
  sse: 'sse'
}))

client.hooks([
  async (context, next) => {
    const login = await getLoginElement()
    const header = await login?.getHeader()
    context.params.headers = {
      ...context.params.headers,
      authorization: header
    }
    return next()
  }
])

// Main chat view
const chatTemplate =
  () => `<div class="drawer drawer-mobile"><input id="drawer-left" type="checkbox" class="drawer-toggle">
  <div class="drawer-content flex flex-col">
    <div class="navbar w-full">
      <div class="navbar-start">
        <label for="drawer-left" class="btn btn-square btn-ghost lg:hidden drawer-button">
          <i class="i-feather-menu text-lg"></i>
        </label>
      </div>
      <div class="navbar-center flex flex-col">
        <p>Feathers Chat</p>
      </div>
      <div class="navbar-end">
        <div class="tooltip tooltip-left" data-tip="Logout">
        <button type="button" id="logout" class="btn btn-ghost"><i class="i-feather-log-out text-lg"></i></button>
      </div>
      </div>
    </div>
    <div id="chat" class="h-full overflow-y-auto px-3"></div>
    <div class="form-control w-full py-2 px-3">
      <form class="input-group overflow-hidden" id="send-message">
        <input name="text" type="text" placeholder="Compose message" class="input input-bordered w-full">
        <button type="submit" class="btn">Send</button>
      </form>
    </div>
  </div>
</div>`

// Helper to safely escape HTML
const escapeHTML = (str) => str.replace(/&/g, '&amp').replace(/</g, '&lt').replace(/>/g, '&gt')

const getGravatarUrl = async (email: string, size = 80) => {
  const data = new TextEncoder().encode(email.trim().toLowerCase())
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`
}

const formatDate = (timestamp) =>
  new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    dateStyle: 'medium'
  }).format(new Date(timestamp))

// Renders a message to the page
const addMessage = async (message) => {
  // The user that sent this message (added by the populate-user hook)
  const { user: email, createdAt } = message
  const chat = document.querySelector('#chat')
  // Escape HTML to prevent XSS attacks
  const text = escapeHTML(message.text)
  const avatar = email ? await getGravatarUrl(email) : ''

  if (chat) {
    chat.innerHTML += `<div class="chat chat-start py-2">
      <div class="chat-image avatar">
        <div class="w-10 rounded-full">
          <img src="${avatar}" />
        </div>
      </div>
      <div class="chat-header pb-1">
        ${email}
        <time class="text-xs opacity-50">${formatDate(createdAt)}</time>
      </div>
      <div class="chat-bubble">${text}</div>
    </div>`

    // Always scroll to the bottom of our message list
    chat.scrollTop = chat.scrollHeight - chat.clientHeight
  }
}

const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async (ev) => {
    if (ev.target.closest(selector)) {
      handler(ev)
    }
  })
}

// "Logout" button click handler
addEventListener('#logout', 'click', async () => {
  const login = await getLoginElement()

  await login?.logoutAndForget()
  await login?.getUser()
})

// "Send" message form submission handler
addEventListener('#send-message', 'submit', async (ev) => {
  // This is the message text input field
  const input = document.querySelector('[name="text"]') as HTMLInputElement

  ev.preventDefault()

  // Create a new message and then clear the input field
  await client.service('messages').create({
    text: input.value
  })

  input.value = ''
})

// Listen to created events and add the new message in real-time
client.service('messages').on('created', addMessage)

const init = async () => {
  document.getElementById('app').innerHTML = chatTemplate()

  await client.setup()

  // Find the latest 25 messages. They will come with the newest first
  const messages = await client.service('messages').find({
    query: {
      $limit: 25
    }
  })

  // We want to show the newest message last
  for (const message of messages.data.reverse()) {
    await addMessage(message)
  }
}

init()
