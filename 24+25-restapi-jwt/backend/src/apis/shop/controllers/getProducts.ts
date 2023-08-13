import { Request, Response, NextFunction } from 'express';

import Product from '../../../lib/models/product';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const currentPage = +req.query.page | 1;
  let perPage = +req.query.items | 15;

  const totalItems = await Product.find({}).countDocuments();
  try {
    let products;

    if (!isNaN(currentPage) && !isNaN(perPage)) {
      products = await Product.find({})
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else if (!isNaN(currentPage) && isNaN(perPage)) {
      perPage = 2;
      products = await Product.find({})
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else {
      products = await Product.find({}); // returns everything
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
