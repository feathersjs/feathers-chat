'use strict';

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
          Signup
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

// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(feathers.socketio(socket));
client.configure(feathers.hooks());
// Use localStorage to store our login token
client.configure(feathers.authentication({
  storage: window.localStorage
}));

// An application object that helps manage the application
const application = {
  // Add a new user to the list
  addUser(user) {
    // Add the user to the list
    document.querySelector('.user-list').insertAdjacentHTML('beforeend', `<li>
      <a class="block relative" href="#">
        <img src="${user.avatar}" alt="" class="avatar">
        <span class="absolute username">${user.email}</span>
      </a>
    </li>`);

    // Update the number of users
    document.querySelector('.online-count').innerHTML = document.querySelectorAll('.user-list li').length;
  },

  // Renders a new message and finds the user that belongs to the message
  addMessage(message) {
    // Find the user belonging to this message or use the anonymous user if not found
    const sender = message.user || {};
    const chat = document.querySelector('.chat');

    chat.insertAdjacentHTML( 'beforeend', `<div class="message flex flex-row">
      <img src="${sender.avatar}" alt="${sender.email}" class="avatar">
      <div class="message-wrapper">
        <p class="message-header">
          <span class="username font-600">${sender.email}</span>
          <span class="sent-date font-300">${moment(message.createdAt).format('MMM Do, hh:mm:ss')}</span>
        </p>
        <p class="message-content font-300">${message.text}</p>
      </div>
    </div>`);

    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  },

  // Log in either using the given email/password or the token from storage
  login(credentials) {
    const payload = credentials ?
      Object.assign({ strategy: 'local' }, credentials) : {};

    return client.authenticate(payload)
      .then(application.showChat)
      .catch(application.showLogin);
  },

  // Show the login page
  showLogin(error = {}) {
    if(document.querySelectorAll('.login').length) {
      document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>`);
    } else {
      document.getElementById('app').innerHTML = loginHTML;
    }
  },

  // Shows the chat page
  showChat() {
    document.getElementById('app').innerHTML = chatHTML;

    // Find the latest 10 messages. They will come with the newest first
    // which is why we have to reverse before adding them
    client.service('messages').find({
      query: {
        $sort: { createdAt: -1 },
        $limit: 25
      }
    }).then(page => {
      page.data.reverse().forEach(application.addMessage);
    });

    // Find all users
    client.service('users').find().then(page => {
      const users = page.data;

      // Add every user to the list
      users.forEach(application.addUser.bind(application));
    });
  },

  // Retrieve email/password object from the login/signup page
  getCredentials() {
    const user = {
      email: document.querySelector('[name="email"]').value,
      password: document.querySelector('[name="password"]').value
    };

    return user;
  }
};

// Listen to created events and add the new message in real-time
client.service('messages').on('created', application.addMessage);

// We will also see when new users get created in real-time
client.service('users').on('created', application.addUser);

document.addEventListener('click', function(ev) {
  switch(ev.target.id) {
    case 'signup': {
      const user = application.getCredentials();

      client.service('users').create(user)
        .then(() => application.login(user));

      break;
    }
    case 'login': {
      const user = application.getCredentials();

      application.login(user);

      break;
    }
    case 'logout': {
      client.logout().then(() => {
         document.getElementById('app').innerHTML = loginHTML;
      });

      break;
    }
  }
});

document.addEventListener('submit', function(ev) {
  if(ev.target.id === 'send-message') {
    // This is the message text input field
    const input = document.querySelector('[name="text"]');

    // Create a new message and then clear the input field
    client.service('messages').create({
      text: input.value
    }).then(() => {
      input.value = '';
    });
    ev.preventDefault();
  }
});

application.login();
