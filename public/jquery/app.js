/* global document, window, feathers, moment, io, $ */

// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(feathers.socketio(socket));
// Use localStorage to store our login token
client.configure(feathers.authentication({
  storage: window.localStorage
}));

// Login screen
const loginHTML = `<main class="login container">
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet text-center heading">
      <h1 class="font-100">Log in or signup</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
      <form class="form">
        <fieldset>
          <input class="block" type="email" name="email" placeholder="email">
        </fieldset>

        <fieldset>
          <input class="block" type="password" name="password" placeholder="password">
        </fieldset>

        <button type="button" id="login" class="button button-primary block signup">
          Log in
        </button>

        <button type="button" id="signup" class="button button-primary block signup">
          Sign up and log in
        </button>
      </form>
    </div>
  </div>
</main>`;

// Chat base HTML (without user list and messages)
const chatHTML = `<main class="flex flex-column">
  <header class="title-bar flex flex-row flex-center">
    <div class="title-wrapper block center-element">
      <img class="logo" src="http://feathersjs.com/img/feathers-logo-wide.png"
        alt="Feathers Logo">
      <span class="title">Chat</span>
    </div>
  </header>

  <div class="flex flex-row flex-1 clear">
    <aside class="sidebar col col-3 flex flex-column flex-space-between">
      <header class="flex flex-row flex-center">
        <h4 class="font-300 text-center">
          <span class="font-600 online-count">0</span> users
        </h4>
      </header>

      <ul class="flex flex-column flex-1 list-unstyled user-list"></ul>
      <footer class="flex flex-row flex-center">
        <a href="#" id="logout" class="button button-primary">
          Sign Out
        </a>
      </footer>
    </aside>

    <div class="flex flex-column col col-9">
      <main class="chat flex flex-column flex-1 clear"></main>

      <form class="flex flex-row flex-space-between" id="send-message">
        <input type="text" name="text" class="flex flex-1">
        <button class="button-primary" type="submit">Send</button>
      </form>
    </div>
  </div>
</main>`;

// Add a new user to the list
const addUser = user => {
  // Escape HTML, can be removed after adding validation on user registration.
  const user_email = user.email
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Add the user to the list
  $('.user-list').append(`<li>
    <a class="block relative" href="#">
      <img src="${user.avatar}" alt="" class="avatar">
      <span class="absolute username">${user_email}</span>
    </a>
  </li>`);
  // Update the number of users
  $('.online-count').html($('.user-list li').length);
};

// Renders a new message and finds the user that belongs to the message
const addMessage = message => {
  // Find the user belonging to this message or use the anonymous user if not found
  const { user = {} } = message;
  const chat = $('.chat');
  const text = message.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Escape HTML, can be removed after adding validation on user registration.
  const user_email = user.email
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const user_email_alt = (user.email === user_email ? user_email : 'user')

  chat.append(`<div class="message flex flex-row">
    <img src="${user.avatar}" alt="${user_email_alt}" class="avatar">
    <div class="message-wrapper">
      <p class="message-header">
        <span class="username font-600">${user_email}</span>
        <span class="sent-date font-300">${moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
      </p>
      <p class="message-content font-300">${text}</p>
    </div>
  </div>`);

  chat.scrollTop(chat[0].scrollHeight - chat[0].clientHeight);
};

// Show the login page
const showLogin = (error = {}) => {
  if($('.login').length) {
    $('.heading').append(`<p>There was an error: ${error.message}</p>`);
  } else {
    $('#app').html(loginHTML);
  }
};

// Shows the chat page
const showChat = async () => {
  $('#app').html(chatHTML);

  // Find the latest 10 messages. They will come with the newest first
  // which is why we have to reverse before adding them
  const messages = await client.service('messages').find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 25
    }
  });

  messages.data.reverse().forEach(addMessage);

  // Find all users
  const users = await client.service('users').find();

  // Add every user to the list
  users.data.forEach(addUser);
};

// Retrieve email/password object from the login/signup page
const getCredentials = () => {
  const user = {
    email: $('[name="email"]').val(),
    password: $('[name="password"]').val()
  };

  return user;
};

// Log in either using the given email/password or the token from storage
const login = async credentials => {
  try {
    if(!credentials) {
      // Try to authenticate using the JWT from localStorage
      await client.authenticate();
    } else {
      // If we get login information, add the strategy we want to use for login
      const payload = Object.assign({ strategy: 'local' }, credentials);

      await client.authenticate(payload);
    }

    // If successful, show the chat page
    showChat();
  } catch(error) {
    // If we got an error, show the login page
    showLogin(error);
  }
};

// Set up event listeners
$(document)
  .on('click', '#signup', async () => {
    const credentials = getCredentials();

    await client.service('users').create(credentials);
    await login(credentials);
  })
  .on('click', '#login', async () => {
    const user = getCredentials();

    await login(user);
  })
  .on('click', '#logout', async () => {
    await client.logout();

    $('#app').html(loginHTML);
  })
  .on('submit', '#send-message', async ev => {
    // This is the message text input field
    const input = $('[name="text"]');

    ev.preventDefault();

    // Create a new message and then clear the input field
    await client.service('messages').create({
      text: input.val()
    });

    input.val('');
  });

// Listen to created events and add the new message in real-time
client.service('messages').on('created', addMessage);

// We will also see when new users get created in real-time
client.service('users').on('created', addUser);

login();
