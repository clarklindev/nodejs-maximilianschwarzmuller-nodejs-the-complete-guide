const path = require('path');

const express = require('express');
require('dotenv').config();

const bodyParser = require('body-parser');
// const errorController = require('./controllers/error');

const mongoConnect = require('./util/database');

const app = express();

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
// User.findById(1)
//   .then((user) => {
//     req.user = user;
//     next();
//   })
//   .catch((err) => console.log(err));
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

// app.use(errorController.get404);

const startConnection = async () => {
  const connection = await mongoConnect();
  app.listen(3000);
  // console.log('connection: ', connection);
  console.log('listening on port 3000');
};
startConnection();
