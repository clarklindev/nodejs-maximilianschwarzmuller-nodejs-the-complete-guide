const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows, fieldData]) => {
    res.status(200).json({ products: rows });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData] = result) => {
      res.status(200).json({ products: rows });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.status(200).json({ product: product[0] });
    })
    .catch((err) => console.log(err));
};
