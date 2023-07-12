import { NextFunction, Request, Response } from 'express';

import Product from '../models/product';
import { validationResult } from 'express-validator';

//Mongoose selective retrieval - tells mongoose which props to retrieve (selective) or which not to retrieve
//Product.find().select('title price -_id'); //return title, price, not _id

//using populate() it can retrieve full object on the prop that is using a ref by using a prop as reference
//const products = await Product.find().populate('userId');
//selective retrieval also works for .populate
//const products = await Product.find().populate('userId', 'name'); //returns ALWAYS _id unless specified not to, and "name"
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();

    //temp hardcoding because above uses session.. and that is different for REST API

    res.status(200).json({ message: 'fetched posts!', products });
  } catch (err: any) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl; //file is binary data...

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error;
  }

  //Mongoose - pass an object to Product - eg... { title (refers to title from schema) : title (refers to req.body.title) }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: '649cfd00d2d73557bd21c294', //or with mongoose: you can reference the entire object req.user and mongoose will get the ._id from there.
  });
  try {
    const result = await product.save();

    res.status(200).json({ status: 'PRODUCT CREATED', product: result });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  // try {
  //   const product = await Product.findById(prodId);

  //   //check if loggedin user is allowed to edit product
  //   if (req.session) {
  //     if (
  //       product?.userId.toString() !== req.session.user?._id.toString() ||
  //       product === null
  //     ) {
  //       //redirect away or return status message
  //       return res.json({ status: 'user not allowed to edit product' });
  //     }
  //   }

  //   if (product) {
  //     product.title = updatedTitle;
  //     product.price = updatedPrice;
  //     product.description = updatedDesc;
  //     product.imageUrl = updatedImageUrl;
  //     const result = await product.save();
  //     res.json({ status: 'PRODUCT EDITED', result });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.json({ error: err });
  // }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const prodId = req.params.productId;
  // try {
  //   if (req.session) {
  //     const result = await Product.deleteOne({
  //       _id: prodId,
  //       userId: req.session.user._id, //extra check that the product.userId must be the same the req.user._id (loggedin user's id)
  //     });
  //     res.status(200).json({ status: 'PRODUCT DELETED', result });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ error: err });
  // }
};
