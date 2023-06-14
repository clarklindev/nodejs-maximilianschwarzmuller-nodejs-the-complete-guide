const path = require('path');
const express = require('express');

require('dotenv').config();

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //get data from form - by parsing the body of the
app.use(express.static(path.join(__dirname, 'public')));

const { mongoConnect } = require('./src/utils/database');

const adminRoutes = require('./src/routes/admin-routes');
const shopRoutes = require('./src/routes/shop-routes');
// const errorController = require('./src/controllers/error');
// app.use((req, res, next) => {
// User.findById(1)
//   .then((user) => {
//     req.user = user;
//     next();
//   })
//   .catch((err) => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
// app.use(errorController.get404);

const startConnection = async () => {
  try {
    await mongoConnect();
    app.listen(3000);
    console.log('listening on port 3000');
  } catch (err) {
    console.log('err: ', err);
  }
};
startConnection();
