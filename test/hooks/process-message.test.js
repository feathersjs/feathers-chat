const assert = require('assert');
const processMessage = require('../../src/hooks/process-message');

describe('\'process-message\' hook', () => {
  it('adds the current user, sets createdAt and does basic escaping', () => {
    // A dummy user
    const user = {
      _id: 'testId'
    };
    // A mock hook object
    const mock = {
      params: {
        user
      },
      data: {
        text: 'test message <br>'
      }
    };
    // Initialize our hook with no options
    const hook = processMessage();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      const { data } = result;
      assert.equal(data.userId, 'testId', 'Set the user id');
      assert.equal(data.text, 'test message &lt;br&gt;');
      assert.ok(data.createdAt, 'Set createdAt property');
    });
  });
});
