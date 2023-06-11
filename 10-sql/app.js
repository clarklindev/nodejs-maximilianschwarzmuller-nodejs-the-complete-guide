const path = require('path');
const express = require('express');
const bodyParser = require('body-parser'); //so we can access req.body
require('dotenv').config(); //this must be imported before routes so anything that needs env variables already has access

const sequelize = require('./src/utils/database');

const shopRoutes = require('./src/routes/shop-routes');
const adminRoutes = require('./src/routes/admin-routes');

const app = express();

app.use(bodyParser.json()); //get data from form - by parsing the body of the request //parse incoming requests for json data
//app.use(bodyParser.urlencoded({ extended: false })); //parse incoming request, urlencoded data in body will be extracted

app.use('/shop/', shopRoutes);
app.use('/admin/', adminRoutes);

sequelize
  .sync()
  .then((result) => {
    // console.log('result: ', result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  }); //looks at models defined, and creates models/tables/relations

console.log('server is running on port 3000');
