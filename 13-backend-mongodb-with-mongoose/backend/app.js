const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').config();

const app = express();

const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-yojaa83-shard-00-00.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-01.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-02.7tcuhtv.mongodb.net:27017/?ssl=true&replicaSet=atlas-1131uo-shard-0&authSource=admin&w=majority`;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //get data from form - by parsing the body of the
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const User = require('./src/models/user');
const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');
const authRoutes = require('./src/routes/auth');

// const errorController = require('./src/controllers/error');

app.use((req, res, next) => {
  if (!req.session.user) {
    next();
  }
  const user = User.findById(req.session.user._id);
  req.user = user;
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// app.use(errorController.get404);

const startConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'shop' });

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
