/* global io, feathers, moment */
// Establish a Socket.io connection
const socket = io()
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers()

client.configure(feathers.socketio(socket))
// Use localStorage to store our login token
client.configure(feathers.authentication())

// Login screen
const loginTemplate = (error) => `<div class="login flex min-h-screen bg-neutral justify-center items-center">
<div class="card w-full max-w-sm bg-base-100 px-4 py-8 shadow-xl">
  <div class="px-4"><i alt="" class="h-32 w-32 block mx-auto i-logos-feathersjs invert"></i>
    <h1 class="text-5xl font-bold text-center my-5 bg-clip-text bg-gradient-to-br">
      Feathers Chat
    </h1>
  </div>
  <form class="card-body pt-2">
    ${
      error
        ? `<div class="alert alert-error justify-start">
      <i class="i-feather-alert-triangle"></i>
      <span class="flex-grow">${error.message}</span>
    </div>`
        : ''
    }
    <div class="form-control">
      <label for="email" class="label"><span class="label-text">Email</span></label>
      <input type="text" name="email" placeholder="enter email" class="input input-bordered">
    </div>
    <div class="form-control mt-0">
      <label for="password" class="label"><span class="label-text">Password</span></label>
      <input type="password" name="password" placeholder="enter password" class="input input-bordered">
    </div>
    <div class="form-control mt-6"><button id="login" type="button" class="btn">Login</button></div>
    <div class="form-control mt-6"><button id="signup" type="button" class="btn">Signup</button></div>
  </form>
</div>
</div>`

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

// Show the login page
const showLogin = () => {
  document.getElementById('app').innerHTML = loginTemplate()
}

// Shows the chat page
const showChat = async () => {
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

// Retrieve email/password object from the login/signup page
const getCredentials = () => {
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  }

  return user
}

// Log in either using the given email/password or the token from storage
const login = async (credentials) => {
  try {
    if (!credentials) {
      // Try to authenticate using an existing token
      await client.reAuthenticate()
    } else {
      // Otherwise log in with the `local` strategy using the credentials we got
      await client.authenticate({
        strategy: 'local',
        ...credentials
      })
    }

    // If successful, show the chat page
    showChat()
  } catch (error) {
    // If we got an error, show the login page
    showLogin(error)
  }
}

const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async (ev) => {
    if (ev.target.closest(selector)) {
      handler(ev)
    }
  })
}

// "Signup and login" button click handler
addEventListener('#signup', 'click', async () => {
  // For signup, create a new user and then log them in
  const credentials = getCredentials()

  // First create the user
  await client.service('users').create(credentials)
  // If successful log them in
  await login(credentials)
})

// "Login" button click handler
addEventListener('#login', 'click', async () => {
  const user = getCredentials()

  await login(user)
})

// "Logout" button click handler
addEventListener('#logout', 'click', async () => {
  await client.logout()

  document.getElementById('app').innerHTML = loginTemplate()
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

// Call login right away so we can show the chat window
// If the user can already be authenticated
login()
