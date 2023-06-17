const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  //Mongoose selective retrieval - tells mongoose which props to retrieve (selective) or which not to retrieve
  //Product.find().select('title price -_id'); //return title, price, not _id

  //using populate() it can retrieve full object on the prop that is using a ref by using a prop as reference
  //const products = await Product.find().populate('userId');
  //selective retrieval also works for .populate
  //const products = await Product.find().populate('userId', 'name'); //returns ALWAYS _id unless specified not to, and "name"

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
    userId: req.user._id, //or with mongoose: you can reference the entire object req.user and mongoose will get the ._id from there.
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

  try {
    const product = await Product.findById(prodId);
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
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
    const result = await Product.findByIdAndDelete(prodId);
    res.json({ status: 'PRODUCT DELETED', result });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};
