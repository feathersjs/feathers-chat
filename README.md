# Feathers Chat

<p align="center">
  <a href="https://feathersjs.com" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://raw.githubusercontent.com/feathersjs/feathers/2b89e0b7fceb42f92c9139f16f3291fa3ff560f1/docs/public/feathersjs.svg" alt="Feathers logo">
  </a>
</p>


<p align="center">
<b>A FeathersJS Chat Application</b>
</p>

<p align="center">
<a href="https://github.com/feathersjs/feathers-chat/actions?query=workflow%3ACI" target="__blank"><img src="https://github.com/feathersjs/feathers-chat/workflows/CI/badge.svg" alt="NPM version"></a>
</p>

<p align="center">
  <a href="https://replit.com/new/github/feathersjs/feathers-chat"><img src="https://replit.com/badge?caption=Try%20Feathers%20on%20Replit" alt="Replit"></a> 
</p>


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

Now go to [http://localhost:3030](http://localhost:3030) to start chatting 🕊️

## Frontend

### Plain JavaScript

A plain JavaScript frontend can be found in the [public](./public/) folder which is hosted statically by the [api server examples](#api-server).

### React

TBD

### VueJS

TBD
