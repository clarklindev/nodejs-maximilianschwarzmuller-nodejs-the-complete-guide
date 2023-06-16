const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.status(200).json({ products: products });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.status(200).json({ products: products });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // method1
  Product.findByPk(prodId)
    .then((product) => {
      res.status(200).json({ product: product });
    })
    .catch((err) => console.log(err));

  //method2
  // Product.findAll({ where: { id: prodId } }).then((products) => {
  //   res
  //     .status(200)
  //     .json({ product: products[0] })
  //     .catch((err) => console.log(err));
  // });
};

//https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
//because of the association we get access to special mixin methods like getCart()
//see README..
exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.json({ products: products });
  } catch (err) {
    console.log(err);
  }
};

//for adding new products to cart
exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const cart = await req.user.getCart(); //get user's cart
    const product = await Product.findByPk(prodId); //find the product
    let newQuantity;

    //find out if product is part of cart
    if (await cart.hasProduct({ where: { id: prodId } })) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      newQuantity = 1;
    }
    await cart.addProduct(product, { through: { quantity: newQuantity } });
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const cart = await req.user.getCart();
    const product = await Product.findByPk(prodId);

    //delete from cartItem (table connecting cart with product)
    await product.cartItem.destroy();
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  const cart = await req.user.getCart();
  const order = await req.user.createOrder();
  const products = cart.getProducts();
  order.addProducts(
    products.map((product) => {
      product.orderItem = { quantity: product.cartItem.quantity };
      return product;
    })
  );
  res.redirect('/orders');
};

exports.getOrders = (req, res, next) => {};

exports.getCheckout = (req, res, next) => {};
