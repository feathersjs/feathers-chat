const assert = require('assert');
const gravatar = require('../../src/hooks/gravatar');

describe('\'gravatar\' hook', () => {
  it('adds `avatar` property with URL to image', () => {
    const expectedUrl = 'https://s.gravatar.com/avatar/6f362e9c29b2f21d935a42eda181044d?s=60';
    // A mock hook object
    const mock = {
      data: {
        email: 'chatter@feathersjs.com'
      }
    };
    // Initialize our hook with no options
    const hook = gravatar();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result.data.avatar, expectedUrl);
    });
  });
});
