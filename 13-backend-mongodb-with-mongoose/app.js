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
    const user = await User.findById('648d9b2926121ba0bf431eed');
    req.user = user;
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
      `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-yojaa83-shard-00-00.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-01.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-02.7tcuhtv.mongodb.net:27017/?ssl=true&replicaSet=atlas-1131uo-shard-0&authSource=admin&retryWrites=true&w=majority`,
      { dbName: 'shop' }
    );

    let user = await User.findOne();
    if (!user) {
      user = new User({
        name: 'Max',
        email: 'max@test.com',
        cart: { items: [] },
      });
      await user.save();
    }

    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log(`listening on port ${port}...`);
  } catch (err) {
    console.log(err);
  }
};
startConnection();
