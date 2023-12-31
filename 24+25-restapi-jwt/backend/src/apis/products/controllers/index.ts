import { NextFunction, Request, Response } from 'express';
import path from 'path';

import Product from '../../../global/models/product';
import User from '../../../global/models/user';
import validate from '../../../global/validators';
import { validationSchema as ProductValidation } from './products.validation';
import { ErrorWithStatus } from '../../../global/interfaces/ErrorWithStatus';
import { IRequest } from '../../../global/interfaces/IRequest';
import { deleteFile } from '../../../global/helpers/deleteFile';

//Mongoose selective retrieval - tells mongoose whIUserDocumentich props to retrieve (selective) or which not to retrieve
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

  const totalItems = await Product.find({}).countDocuments();
  try {
    let products;

    if (!isNaN(currentPage) && !isNaN(perPage)) {
      products = await Product.find({ userId: req.userId })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else if (!isNaN(currentPage) && isNaN(perPage)) {
      perPage = 2;
      products = await Product.find({ userId: req.userId })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else {
      products = await Product.find({ userId: req.userId }); // returns everything
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

    console.log('BACKEND product: ', product);

    if (product.userId.toString() !== req.userId) {
      //meaning loggedin user is not authorised to edit this product
      const error: ErrorWithStatus = new Error(
        'unauthorized action for this logged in user'
      );
      error.statusCode = 500;
      throw error;
    }

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

  try {
    const product = await Product.findById(prodId)!;

    const productUserId = product.userId.toString();
    const requestUserId = req.userId.toString();
    console.log('productUserId: ', productUserId);
    console.log('requestUserId: ', requestUserId);

    if (productUserId !== requestUserId) {
      const error: ErrorWithStatus = new Error('invalid authentication');
      error.statusCode = 403;
      throw error;
    }

    let result;

    //we know something got updated so delete old image
    if (product) {
      if (imageUrl !== product.imageUrl) {
        deleteFile(path.join(process.cwd(), 'images', product.imageUrl!));
      }
      product.title = updatedTitle;
      product.description = updatedDescription;
      product.price = updatedPrice;
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
      deleteFile(path.join(process.cwd(), 'images', product.imageUrl!));
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

  if (product.userId.toString() !== req.userId) {
    const error: ErrorWithStatus = new Error('invalid authentication');
    error.statusCode = 403;
    throw error;
  }

  try {
    deleteFile(path.join(process.cwd(), 'images', product.imageUrl!));

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
