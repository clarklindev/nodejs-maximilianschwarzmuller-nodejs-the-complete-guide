//getProduct

import { Request, Response, NextFunction } from 'express';

import Product from '../../../lib/models/product';
import { IError } from '../../../lib/interfaces/IError';
import { IProduct } from '../../../lib/interfaces/IProduct';

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.params.productId;

  //1. find product
  const product: IProduct | null = await Product.findById(prodId);
  if (!product) {
    const error: IError = new Error('Product not found');
    error.statusCode = 404;
    return next(error);
  }

  //2. check if products' userId is same as request userId
  if (product.userId.toString() !== req.userId) {
    //meaning loggedin user is not authorised to edit this product
    const error: IError = new Error('unauthorized action for this logged in user');
    error.statusCode = 500;
    return next(error);
  }

  //3. return product
  return res.status(200).json({ message: 'fetched product.', product });
};
