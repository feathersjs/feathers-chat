const { authenticate } = require('@feathersjs/authentication').hooks;

const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;

const gravatar = require('../../hooks/gravatar');

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [],
    create: [hashPassword(), gravatar()],
    update: [ hashPassword() ],
    patch: [ hashPassword() ],
    remove: []
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
