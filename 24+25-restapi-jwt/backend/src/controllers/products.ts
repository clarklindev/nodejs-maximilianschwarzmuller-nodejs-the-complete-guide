import { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import mongoose, { SchemaType, Types } from 'mongoose';

import Product from '../models/product';
import User from '../models/user';
import validate from '../global/validators/validate';
import { validationSchema as ProductValidation } from './products.validation';
import { ErrorWithStatus } from '../global/interfaces/ErrorWithStatus';
import { IProduct } from '../global/interfaces/IProduct';
import { IRequest } from '../global/interfaces/IRequest';
import { IUser, IUserDocument } from '../global/interfaces/IUser';

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
  const currentPage = +req.query.page!;
  let perPage = +req.query.items!;

  const totalItems = await Product.find().countDocuments();
  try {
    let products;

    if (!isNaN(currentPage) && !isNaN(perPage)) {
      products = await Product.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else if (!isNaN(currentPage) && isNaN(perPage)) {
      perPage = 2;
      products = await Product.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else {
      products = await Product.find(); // returns everything
    }

    return res.status(200).json({
      message: 'fetched posts!',
      products,
      totalItems,
      perPage: perPage,
      page: currentPage,
    }); //totalItems is needed when you return within pagination
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
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  //validate
  const validationErrors = validate(req.body, ProductValidation);

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
        userId: req.userId, //or with mongoose: you can reference the entire object req.user and mongoose will get the ._id from there.
      });

      const result = await product.save();

      //find the user thats associated with this product added
      const user = await User.findById(req.userId); //reminder: we stored userId in the 'req' in isAuth.ts
      user.addToProducts(product._id);

      return res.status(200).json({
        status: 'PRODUCT CREATED',
        product: result,
        creator: { _id: user._id, username: user.username },
      });
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
  const validationErrors = validate(req.body, ProductValidation);

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

  //check if logged in user is allowed to edit product
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

    let result;

    //we know something got updated so delete old image
    if (product && imageUrl !== product.imageUrl) {
      deleteImage(product.imageUrl!);
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = imageUrl;
      result = await product.save();
    }

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
    const userProducts = await Product.find({ userId: req.userId });

    //allows only to delete the product images associated with logged in user
    //delete the image associated
    userProducts.forEach((item) => {
      deleteImage(item.imageUrl!);
    });

    const result = await Product.deleteMany({ userId: req.userId });

    //also delete all products for user
    const user = await User.findById(req.userId);
    user.products = [];
    user.save();

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
  const product = await Product.findById(prodId);
  if (!product) {
    const error: ErrorWithStatus = new Error('Could not find product');
    error.statusCode = 404;
    throw error;
  }

  try {
    deleteImage(product.imageUrl!);

    const result = await Product.deleteOne({
      _id: prodId,
    });

    //also delete product from user reference
    const user = await User.findById(req.userId);
    user.products.pull(prodId); //pass into pull() id of product to remove
    user.save();

    return res.status(200).json({ status: 'PRODUCT DELETED', result });
  } catch (err) {
    next(err);
  }
};

const deleteImage = (file: string) => {
  const filePath = path.join(process.cwd(), 'images', file);
  fs.unlink(filePath, (err) => console.log(err));
};
