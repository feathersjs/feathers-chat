const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const populateUser = require('../../src/hooks/populate-user');

describe('\'populate-user\' hook', () => {
  let app, user;
  
  beforeEach(async () => {
    const options = {
      paginate: {
        default: 10,
        max: 25
      }
    };

    app = feathers();
    
    app.use('/users', memory(options));
    app.use('/messages', memory(options));

    // Add the hook to the dummy service
    app.service('messages').hooks({
      after: populateUser()
    });

    user = await app.service('users').create({
      email: 'test@user.com'
    });
  });
  
  it('populates a new message with the user', async () => {
    const message = await app.service('messages').create({
      text: 'A test message',
      userId: user.id
    });

    assert.deepEqual(message.user, user);
  });
});
