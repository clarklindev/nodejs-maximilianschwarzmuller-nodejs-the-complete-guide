const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); //this must be imported before routes so anything that needs env variables already has access

const appRoutes = require('./src/routes/shop-routes');
const adminRoutes = require('./src/routes/admin-routes');

const app = express();

app.use(bodyParser.json()); //get data from form - by parsing the body of the request //parse incoming requests for json data
//app.use(bodyParser.urlencoded({ extended: false })); //parse incoming request, urlencoded data in body will be extracted

app.use(appRoutes);
app.use(adminRoutes);

app.listen(3000);
console.log('server is running on port 3000');
