## install

"body-parser": "^1.20.2",
"dotenv": "^16.1.4",
"express": "^4.18.2",
"mysql2": "^3.3.3"

- mysql community server
- mysql workbench

OR

- mysql installer but ensure that you install
  - mysql community server
  - mysql workbench

## express

```js
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json()); //get data from form - by parsing the body of the request //parse incoming requests for json data
```

## configure

- configure mysql server - authentication method - use legacy password encryption
- choose a password for root user (password)
- create a schema

## npm install mysql2

```
npm i mysql2
```

## setting up db

```js
// database.js
// connect to database
require('dotenv').config();

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: process.env.MYSQL_PASSWORD,
});

module.exports = pool.promise();
```

## getting data from db

- use db.exectute() to run sql

```js
const db = require('./src/utils/database');

db.execute('SELECT * FROM products')
  .then((result) => {
    console.log(result[0]);
  })
  .catch((err) => {
    console.log(err);
  });
```

## accessible routes

src/routes/

## Sequelize

- use sequelize to replace the need for SQL queries
- drop db on mysql workbench (restart using sequelize)

```
npm i mysql2
npm i sequelize
```
