const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Product.build then .save() OR .create() does both
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  })
    .then((result) => {
      console.log(result);
      res.status(200).json({ status: 'PRODUCT CREATED' });
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.status(200).json({ products: products });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err });
    });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.status(200).json({ product: product });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err });
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log('updated product!');
      res.status(200).json({ status: 'UPDATED PRODUCT' });
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err });
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ error: err });
    });
  // OPTION2: Product.destroy({where:{ }})
};
