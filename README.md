# feathers-chat

[![Greenkeeper badge](https://badges.greenkeeper.io/feathersjs/feathers-chat.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/feathersjs/feathers-chat/master.svg)](https://travis-ci.org/feathersjs/feathers-chat)
[![Dependency Status](https://img.shields.io/david/feathersjs/feathers-chat.svg)](https://david-dm.org/feathersjs/feathers-chat)

> A Feathers real-time chat application

> __Important:__ This repository requires Node v8.0.0 or later.

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications. It provides a chat API created in [this guide](https://docs.feathersjs.com/guides/chat/readme.html) and a frontend in plain JavaScript and jQuery.

Other chat frontends can be found at:

- [feathersjs-ecosystem/feathers-chat-react](https://github.com/feathersjs-ecosystem/feathers-chat-react)
- [feathersjs-ecosystem/feathers-react-native-chat](https://github.com/feathersjs-ecosystem/feathers-react-native-chat)
- [feathersjs-ecosystem/feathers-chat-angular](https://github.com/feathersjs-ecosystem/feathers-chat-angular)
- [feathers-plus/feathers-chat-vuex](https://github.com/feathers-plus/feathers-chat-vuex)

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/feathers-chat
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

4. Goto to browser and go to [localhost:3030/vanilla](http://localhost:3030/vanilla/)
5. You can login with User `feathers@example.com` pass: `secret` detailed in the [guide](https://docs.feathersjs.com/guides/chat/authentication.html#create-the-user)

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
