import { Request, Response, NextFunction } from 'express';
import path from 'path';

import Product from '../../../lib/models/product';
import User from '../../../lib/models/user';
import { IError } from '../../../lib/interfaces/IError';
import { deleteFile } from '../../../lib/helpers/deleteFile';

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if (!product) {
    const error: IError = new Error('Could not find product');
    error.statusCode = 404;
    throw error;
  }

  if (product.userId.toString() !== req.userId) {
    const error: IError = new Error('invalid authentication');
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
