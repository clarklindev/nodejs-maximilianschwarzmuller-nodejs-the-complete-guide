const path = require('path');
const express = require('express');

require('dotenv').config();

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //get data from form - by parsing the body of the
app.use(express.static(path.join(__dirname, 'public')));

const { mongoConnect } = require('./src/utils/database');

const User = require('./src/models/user');
const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');
// const errorController = require('./src/controllers/error');

//adds .user to req
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('648d9b2926121ba0bf431eed');
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  } catch (err) {
    console.log(err);
    throw err;
  }
});

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
