const sequelize = require('sequelize');
const path = require('path');

module.exports = function (app) {
  const message = app.get('sequelizeClient').define('messages', {
    text: {
      type: sequelize.STRING,
      allowNull: false
    }
  });
  message.associate = function (models) {
    message.belongsTo(models.users);
  };
  return message;
};
