const Product = require('../models/product');
const Order = require('../models/order');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = getProducts;
exports.getIndex = getProducts;

exports.getCart = async (req, res, next) => {
  try {
    console.log('req.user: ', req.user);
    const user = await req.user.populate('cart.items.productId');

    const products = user.cart.items;

    res.json({ products });
  } catch (err) {
    console.log(err);
  }
};

// //for adding new products to cart
exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    const result = await req.user.addToCart(product);
    console.log('result: ', result);
    res.json({ result });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

exports.cartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const result = await req.user.deleteFromCart(prodId);
    res.json({ result });
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId');

    //SEE MODELS for order: order products has object: {product, quantity} props but cart stores {productId, quantity}
    const products = user.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });

    const order = new Order({
      user: {
        email: req.user.name,
        userId: req.user, //mongoose: here... gets id automatically from the object (user)
      },
      products,
    });

    const result = await order.save();
    await req.user.clearCart();

    res.json({ result, products });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find({ 'user.userId': req.user._id });

  res.json({ orders });
};

// exports.getCheckout = (req, res, next) => {};
