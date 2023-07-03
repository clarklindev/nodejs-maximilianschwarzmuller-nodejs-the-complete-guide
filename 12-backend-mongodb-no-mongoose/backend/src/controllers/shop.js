const Product = require('../models/product');
const { getDb } = require('../utils/database');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.status(200).json({ products });
  } catch (err) {
    console.log(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    console.log('prodId: ', prodId);
    const product = await Product.findById(prodId);
    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = getProducts;
exports.getIndex = getProducts;
exports.getProduct = getProduct;

exports.getCart = async (req, res, next) => {
  try {
    console.log('req.user: ', req.user);
    const products = await req.user.getCart();
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
    const result = await req.user.addOrder();
    res.json({ result });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders();
  res.json({ orders });
};

// exports.getCheckout = (req, res, next) => {};
