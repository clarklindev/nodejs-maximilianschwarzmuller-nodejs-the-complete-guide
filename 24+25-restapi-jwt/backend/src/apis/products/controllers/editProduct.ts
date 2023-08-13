//editProduct
import { Request, Response, NextFunction } from 'express';
import path from 'path';

import Product from '../../../lib/models/product';
import { IError } from '../../../lib/interfaces/IError';
import { deleteFile } from '../../../lib/helpers/deleteFile';

export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.params.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const upload = req.file; //thanks to multer middleware, we have access to file and not just text from the form.

  const imageUrl = !upload ? req.body.imageUrl : upload.filename;
  if (!imageUrl) {
    const error: IError = new Error('invalid file format');
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
      const error: IError = new Error('invalid authentication');
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
