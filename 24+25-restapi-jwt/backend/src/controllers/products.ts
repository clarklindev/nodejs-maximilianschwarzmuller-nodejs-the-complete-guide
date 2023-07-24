import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import Product from '../models/product';
import validate from '../global/validators/validate';
import { validationSchema } from './products.validation';
import { ErrorWithStatus } from '../global/interfaces/ErrorWithStatus';

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
  const currentPage = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.items) || 2;
  const totalItems = await Product.find().countDocuments();

  try {
    const products = await Product.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    return res
      .status(200)
      .json({ message: 'fetched posts!', products, totalItems, perPage });
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
    return res.status(200).json({ message: 'fetched product.', product });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
};

//addProduct should receive an upload image
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //validate
  const validationErrors = validate(req.body, validationSchema);

  if (validationErrors) {
    // Handle validation errors
    console.log(validationErrors);
    return res.status(422).json({ validationErrors: validationErrors });
  }

  console.log('req.file: ', req.file);
  console.log('Validation passed');

  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const upload = req.file;

  //if no file was uploaded
  if (!upload) {
    const error: ErrorWithStatus = new Error('No file uploaded');
    error.statusCode = 422;
    throw error;
  }

  try {
    const createProduct = async () => {
      //Mongoose - pass an object to Product - eg... { title (refers to title from schema) : title (refers to req.body.title) }
      const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: upload.filename, //not the path, store just the image - makes things easier to maintain
        userId: '649cfd00d2d73557bd21c294', //or with mongoose: you can reference the entire object req.user and mongoose will get the ._id from there.
      });
      const result = await product.save();

      return res
        .status(200)
        .json({ status: 'PRODUCT CREATED', product: result });
    };
    createProduct();
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
  //validate
  const validationErrors = validate(req.body, validationSchema);

  if (validationErrors) {
    // Handle validation errors
    console.log(validationErrors);
    return res.status(500).json({ validationErrors: validationErrors });
  }

  const prodId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const upload = req.file; //thanks to multer middleware, we have access to file and not just text from the form.

  const imageUrl = !upload ? req.body.imageUrl : upload.filename;
  if (!imageUrl) {
    const error: ErrorWithStatus = new Error('invalid file format');
    error.statusCode = 422;
    throw error;
  }

  //check if loggedin user is allowed to edit product
  // if (req.session) {
  //   if (
  //     product?.userId.toString() !== req.session.user?._id.toString() ||
  //     product === null
  //   ) {
  //     //redirect away or return status message
  //     return res.json({ status: 'user not allowed to edit product' });
  //   }
  // }

  try {
    const product = await Product.findById(prodId)!;

    //we know something got updated so delete old image
    if (imageUrl !== product.imageUrl) {
      deleteImage(product.imageUrl);
    }

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;
    product.imageUrl = imageUrl;

    const result = await product.save();

    return res.status(200).json({ status: 'PRODUCT EDITED', result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //TODO- need to add authentication test

    const result = await Product.deleteMany({});
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.params.productId;
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

  const product = await Product.findById(prodId);
  if (!product) {
    const error: ErrorWithStatus = new Error('Could not find product');
    error.statusCode = 404;
    throw error;
  }

  try {
    deleteImage(product.imageUrl);

    const result = await Product.deleteOne({
      _id: prodId,
    });
    return res.status(200).json({ status: 'PRODUCT DELETED', result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deleteImage = (file) => {
  const filePath = path.join(process.cwd(), 'images', file);
  fs.unlink(filePath, (err) => console.log(err));
};
