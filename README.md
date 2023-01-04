# feathers-chat

[![CI](https://github.com/feathersjs/feathers-chat/workflows/CI/badge.svg)](https://github.com/feathersjs/feathers-chat/actions?query=workflow%3ACI)

> A FeathersJS chat application

## About

This repository includes the server application from the [official Feathers chat guide](https://dove.feathersjs.com/guides/basics/generator.html) as well as chat frontend examples for different frameworks.

## API server

### TypeScript

The TypeScript version of the chat API server can be found in the [feathers-chat-ts](./feathers-chat-ts/). To start it install the dependencies like this:

```
cd feathers-chat-ts
npm install
```

Then compile the source code and run the database migration which will initialize an SQLite database in the `feathers-chat.sqlite` file.

```
npm run compile
npm run migrate
```

It can now be started with:

```
npm start
```

Or in development mode with

```
npm run dev
```

Now go to [http://localhost:30303](http://localhost:30303) to start chatting 🕊️

## Frontend

### Plain JavaScript

A plain JavaScript frontend can be found in the [public](./public/) folder which is hosted statically by the [api server examples](#api-server).

### React

TBD

### VueJS

TBD
