//deleteAllProducts
import { Request, Response, NextFunction } from 'express';
import path from 'path';

import Product from '../../../lib/models/product';
import User from '../../../lib/models/user';
import { deleteFile } from '../../../lib/helpers/deleteFile';
import { IUser } from '../../../lib/interfaces/IUser';
import { IError } from '../../../lib/interfaces/IError';
import { IProduct } from '../../../lib/interfaces/IProduct';

export const deleteAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  //PRODUCT
  //allows only to delete the product images associated with logged in user
  const userProducts: Array<IProduct> | null = await Product.find({ userId: req.userId });

  if (userProducts.length === 0) {
    //nothing belongs to logged in user - to delete from Product
    return;
  }
  //FILE
  //delete the file - image associated
  userProducts.forEach((product: IProduct) => {
    deleteFile(path.join(process.cwd(), 'images', product.imageUrl));
  });

  //delete from database Product entries
  const result = await Product.deleteMany({ userId: req.userId }); //returns information about the delete operation itself.

  //USER
  //also delete all products for user
  let user: IUser | null;
  try {
    user = await User.findById(req.userId);
    if (!user) {
      const error: IError = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    user.products = [];
    user.save();
    return res.status(200).json(result);
  } catch (err) {
    const error: IError = new Error('Database error');
    error.statusCode = 500;
    return next(error);
  }
};
