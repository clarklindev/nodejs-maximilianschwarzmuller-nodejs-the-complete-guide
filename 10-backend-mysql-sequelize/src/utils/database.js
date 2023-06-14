const Sequelize = require('sequelize');

//create node-complete db, username, password
const sequelize = new Sequelize(
  'node-complete',
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    dialect: 'mysql',
    host: 'localhost',
  }
);

module.exports = sequelize;
