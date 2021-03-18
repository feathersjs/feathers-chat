# feathers-chat sequelize PostgreSQL

This is a fork of the Feathers.js hello world app https://github.com/feathersjs/feathers-chat but working on PostgreSQL via sequelize instead of the default disk-based NeDB.

This achieves a similar goal to:

- https://github.com/pedrogk/feathers-chat-sequelize
- https://github.com/catalyst-technologies/feathers-chat-pgsql

but both of those were failing on my Ubuntu 20.10 Node 14.16.0 presumably because of my incompatible Node/PostgreSQL versions, and I couldn't easily find in which versions the authors had tested to reproduce without further debugging.

So in the end I just took inspiration from their code, and re-ported the official feathers-chat instead, since that was working out-of-the box on my system.

The original motivation for this is to be able to run in Heroku, which provides a PostgreSQL database, but no persistent filesystem storage: https://stackoverflow.com/questions/42775418/heroku-local-persistent-storage

To run, all you need to do is to first ensure that the PostgreSQL connection string under [config/default.json](config/default.json) is correct:

```
  "postgres": "postgres://user0:a@localhost:5432/feathers_chat"
```

which means creating that user and database with commands along the lines of:

```
createuser -P user0
createdb user0
createdb feathers_chat
psql -c 'GRANT ALL PRIVILEGES ON DATABASE feathers_chat TO user0'
```

Once that is done, just run as usual:
```
npm install
npm start
```
