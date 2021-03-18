const assert = require('assert');
const app = require('../../src/app');

describe('\'db\' service', () => {
  it('registered the service', () => {
    const service = app.service('db');

    assert.ok(service, 'Registered the service');
  });
});
