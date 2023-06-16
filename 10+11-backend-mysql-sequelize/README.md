# Backend

- using sequelize

## install

- install mysql / mysql workbench

  - mysql community server
  - mysql workbench

OR

- mysql installer but ensure that you install

  - mysql community server
  - mysql workbench

- npm packages
  "body-parser": "^1.20.2",
  "dotenv": "^16.1.4",
  "express": "^4.18.2",
  <!-- "mysql2": "^3.3.3" -->   //replaced by sequelize
  "sequelize"

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
<!--

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

````js
const db = require('./src/utils/database');

db.execute('SELECT * FROM products')
  .then((result) => {
    console.log(result[0]);
  })
  .catch((err) => {
    console.log(err);
  });
``` -->

## accessible routes

src/routes/

## Sequelize

- alternative to mysql2 npm package
- use sequelize to replace the need for SQL queries
- drop db on mysql workbench (restart using sequelize)
- read up on model associations - https://sequelize.org/docs/v6/core-concepts/assocs/

- https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  - When an association is defined between two models, the instances of those models gain special methods to interact with their associated counterparts.
  - associations are defined in pairs.

  #### eg. Foo.hasOne(Bar)
  - fooInstance.getBar()
  - fooInstance.setBar()
  - fooInstance.createBar()

  #### eg. Foo.belongsTo(Bar)
  - fooInstance.getBar()
  - fooInstance.setBar()
  - fooInstance.createBar()

  #### eg. Foo.hasMany(Bar)
  - fooInstance.getBars()
  - fooInstance.countBars()
  - fooInstance.hasBar()
  - fooInstance.hasBars()
  - fooInstance.setBars()
  - fooInstance.addBar()
  - fooInstance.addBars()
  - fooInstance.removeBar()
  - fooInstance.removeBars()
  - fooInstance.createBar()

  #### eg. Foo.belongsToMany(Bar, { through: Baz })
  - fooInstance.getBars()
  - fooInstance.countBars()
  - fooInstance.hasBar()
  - fooInstance.hasBars()
  - fooInstance.setBars()
  - fooInstance.addBar()
  - fooInstance.addBars()
  - fooInstance.removeBar()
  - fooInstance.removeBars()
  - fooInstance.createBar()
````

npm i mysql2
npm i sequelize

````

### create a db

```js
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
````

### define table

```js
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

//define a table with attributes
const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
```

### sync Sequelize to mysql

```js
const sequelize = require('./src/utils/database');
sequelize
  .sync()
  .then((result) => {
    // console.log('result: ', result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  }); //looks at models defined, and creates models/tables/relations
```

### call a backend method

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
```

### using findByPk

```js
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // method1
  Product.findByPk(prodId)
    .then((product) => {
      res.status(200).json({ product: product });
    })
    .catch((err) => console.log(err));

  //method2
  // Product.findAll({ where: { id: prodId } }).then((products) => {
  //   res
  //     .status(200)
  //     .json({ product: products[0] })
  //     .catch((err) => console.log(err));
  // });
};
```
