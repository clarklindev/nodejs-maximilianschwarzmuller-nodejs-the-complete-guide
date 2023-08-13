import { Request, Response, NextFunction } from 'express';

import Product from '../../../lib/models/product';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const currentPage = +req.query.page; //comes from query params "page"
  let perPage = +req.query.items; //comes from query params "items"

  const totalItems = await Product.find({}).countDocuments();
  try {
    let products;

    //currentPage and perPage both in query string...
    if (!isNaN(currentPage) && !isNaN(perPage)) {
      products = await Product.find({ userId: req.userId })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    }

    //"currentPage" is given - but "perPage" isnt..
    else if (!isNaN(currentPage) && isNaN(perPage)) {
      perPage = 2;
      products = await Product.find({ userId: req.userId })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    }

    //return everything it can find with same userId
    else {
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
