const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const sequelize = require('./src/utils/database');
const Product = require('./src/models/product');
const User = require('./src/models/user');
const Cart = require('./src/models/cart');
const CartItem = require('./src/models/cart-item');
const Order = require('./src/models/order');
const OrderItem = require('./src/models/order-item');

const shopRoutes = require('./src/routes/shop-routes');
const adminRoutes = require('./src/routes/admin-routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//middleware
app.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(1);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use('/shop/', shopRoutes);
app.use('/admin/', adminRoutes);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
//just list one direction of relation
User.hasOne(Cart);
Cart.belongsTo(User);
//many to many relationship - with intermediate CartItem model
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

const startServer = async () => {
  try {
    await sequelize.sync();
    // await sequelize.sync({ force: true });
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({ name: 'test', email: 'test@test.com' });
      await user.createCart(); //https://sequelize.org/docs/v6/core-concepts/assocs/
    }

    app.listen(3000);
    console.log('Server is running on port 3000');
  } catch (err) {
    console.log(err);
  }
};

startServer();
console.log('Server is running on port 3000');
