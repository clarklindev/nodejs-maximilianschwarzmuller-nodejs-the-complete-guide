// // connect to database
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: process.env.MYSQL_PASSWORD,
// });

// module.exports = pool.promise();

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
