// Initializes the `db` service on path `/db`
const { Db } = require('./db.class');
const createModel = require('../../models/db.model');
const hooks = require('./db.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/db', new Db(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('db');

  service.hooks(hooks);
};
