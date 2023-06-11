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
