/* global io, feathers */

// Establish a Socket.io connection
const socket = io()
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers()

client.configure(feathers.socketio(socket))
// Use localStorage to store our login token
client.configure(feathers.authentication())

// Reference the talon-login element from the DOM
const talonLogin = document.getElementById('talon-login')

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
        <label for="drawer-right" class="text-xs cursor-pointer">
          <span class="online-count">0</span> User(s)
        </label>
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
  <div class="drawer-side"><label for="drawer-left" class="drawer-overlay"></label>
    <ul class="menu user-list compact p-2 overflow-y-auto w-60 bg-base-300 text-base-content">
      <li class="menu-title"><span>Users</span></li>
    </ul>
  </div>
</div>`

// Helper to safely escape HTML
const escapeHTML = (str) => str.replace(/&/g, '&amp').replace(/</g, '&lt').replace(/>/g, '&gt')

const formatDate = (timestamp) =>
  new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    dateStyle: 'medium'
  }).format(new Date(timestamp))

// Add a new user to the list
const addUser = (user) => {
  const userList = document.querySelector('.user-list')

  if (userList) {
    // Add the user to the list
    userList.innerHTML += `<li class="user">
      <a>
        <div class="avatar indicator">
          <div class="w-6 rounded"><img src="${user.avatar}" alt="${user.email}"></div>
        </div><span>${user.email}</span>
      </a>
    </li>`

    // Update the number of users
    const userCount = document.querySelectorAll('.user-list li.user').length

    document.querySelector('.online-count').innerHTML = userCount
  }
}

// Renders a message to the page
const addMessage = (message) => {
  // The user that sent this message (added by the populate-user hook)
  const { user = {} } = message
  const chat = document.querySelector('#chat')
  // Escape HTML to prevent XSS attacks
  const text = escapeHTML(message.text)

  if (chat) {
    chat.innerHTML += `<div class="chat chat-start py-2">
      <div class="chat-image avatar">
        <div class="w-10 rounded-full">
          <img src="${user.avatar}" />
        </div>
      </div>
      <div class="chat-header pb-1">
        ${user.email}
        <time class="text-xs opacity-50">${formatDate(message.createdAt)}</time>
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
  await client.logout()
  await talonLogin.logout()
})

// "Send" message form submission handler
addEventListener('#send-message', 'submit', async (ev) => {
  // This is the message text input field
  const input = document.querySelector('[name="text"]')

  ev.preventDefault()

  // Create a new message and then clear the input field
  await client.service('messages').create({
    text: input.value
  })

  input.value = ''
})

// Listen to created events and add the new message in real-time
client.service('messages').on('created', addMessage)

// We will also see when new users get created in real-time
client.service('users').on('created', addUser)

const initialize = async () => {
  const accessToken = await talonLogin.getAccessToken()

  await client.authenticate({
    strategy: 'talon',
    accessToken
  })

  document.getElementById('app').innerHTML = chatTemplate()

  // Find the latest 25 messages. They will come with the newest first
  const messages = await client.service('messages').find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 25
    }
  })

  // We want to show the newest message last
  messages.data.reverse().forEach(addMessage)

  // Find all users
  const users = await client.service('users').find()

  // Add each user to the list
  users.data.forEach(addUser)
}

// Call login right away so we can show the chat window
// If the user can already be authenticated
initialize()
