const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  //get products for current user..
  const products = await Product.find();
  res.status(200).json({ products });
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};

exports.addProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;

  //Mongoose - pass an object to Product - eg... { title (refers to title from schema) : title (refers to req.body.title) }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
  });

  try {
    await product.save();
    res.status(200).json({ status: 'PRODUCT CREATED' });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

exports.editProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDesc,
    updatedImageUrl,
    prodId,
    req.user._id
  );
  try {
    const result = await product.save();
    res.json({ status: 'PRODUCT EDITED', result });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const result = await Product.deleteById(prodId);
    res.json({ status: 'PRODUCT DELETED', result });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};
