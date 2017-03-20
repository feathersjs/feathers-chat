import React, { Component } from 'react';
import Login from './login';
import Chat from './chat';
import client from './feathers';

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const messages = client.service('messages');
    const users = client.service('users');

    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => this.setState({ login: null }));

    // On successfull login
    client.on('authenticated', login => {
      // Get all users and messages
      Promise.all([
        messages.find({
          query: {
            $sort: { createdAt: -1 },
            $limit: 25
          }
        }),
        users.find()
      ]).then( ([ messagePage, userPage ]) => {
        // We want the latest messages but in the reversed order
        const messages = messagePage.data.reverse();
        const users = userPage.data;

        // Once both return, update the state
        this.setState({ login, messages, users });
      });
    });

    // On logout reset all all local state (which will then show the login screen)
    client.on('logout', () => this.setState({
      login: null,
      messages: null,
      users: null
    }));

    // Add new messages to the message list
    messages.on('created', message => this.setState({
      messages: this.state.messages.concat(message)
    }));

    // Add new users to the user list
    users.on('created', user => this.setState({
      users: this.state.users.concat(user)
    }));
  }

  render() {
    if(this.state.login === undefined) {
      return <main className="container text-center">
        <h1>Loading...</h1>
      </main>;
    } else if(this.state.login) {
      return <Chat messages={this.state.messages} users={this.state.users} />
    }

    return <Login />;
  }
}

export default Application;
