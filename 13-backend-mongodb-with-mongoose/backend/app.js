const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf'); //required for server-side rendering...

require('dotenv').config();

const app = express();
//mongodb atlas node 5.5 - hit or miss
//const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.7tcuhtv.mongodb.net/?retryWrites=true&w=majority`;

//mongodb atlas node 2.2.12
const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-yojaa83-shard-00-00.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-01.7tcuhtv.mongodb.net:27017,ac-yojaa83-shard-00-02.7tcuhtv.mongodb.net:27017/?ssl=true&replicaSet=atlas-1131uo-shard-0&authSource=admin&retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  databaseName: 'auth',
  collection: 'sessions',
});

// const csrfProtection = csrf(); //required for server-side rendering...

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); //handling <form> post data, "false" - parsing the URL-encoded data with the querystring library or the qs library (when true)
app.use(bodyParser.json()); //parse json application/json

//cross origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //allows sending
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Origin, X-Requested-With, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.use(csrfProtection); //required for server-side rendering...

const User = require('./src/models/user');
const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');
const authRoutes = require('./src/routes/auth');

// const errorController = require('./src/controllers/error');

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

//SERVERSIDE - for every request - set local variables to pass into views
// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// app.use(errorController.get404);

const startConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'shop' });
    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log(`listening on port ${port}...`);
  } catch (err) {
    console.log(err);
  }
};
startConnection();
