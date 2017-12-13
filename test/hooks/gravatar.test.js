const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const gravatar = require('../../src/hooks/gravatar');

describe('\'gravatar\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();
    
    // A dummy users service for testing
    app.use('/users', {
      async create(data) {
        return data;
      }
    });

    // Add the hook to the dummy service
    app.service('users').hooks({
      before: {
        create: gravatar()
      }
    });
  });

  it('creates a gravatar link from the users email', async () => {
    const user = await app.service('users').create({
      email: 'test@example.com'
    });

    assert.deepEqual(user, {
      email: 'test@example.com',
      avatar: 'https://s.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?s=60'
    });
  });
});
