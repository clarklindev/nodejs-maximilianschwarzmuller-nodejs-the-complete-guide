const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //get data from form - by parsing the body of the
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./src/models/user');
const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');
// const errorController = require('./src/controllers/error');

//adds .user to req
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('648bac5406105f612075b996');
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
    await mongoose.connect(
      `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-one7kcu-shard-00-00.g7sijtf.mongodb.net:27017,ac-one7kcu-shard-00-01.g7sijtf.mongodb.net:27017,ac-one7kcu-shard-00-02.g7sijtf.mongodb.net:27017/?ssl=true&replicaSet=atlas-edr9tf-shard-0&authSource=admin&retryWrites=true&w=majority`
    );
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};
startConnection();
