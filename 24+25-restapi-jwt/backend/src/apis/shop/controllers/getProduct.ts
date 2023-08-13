import { Request, Response, NextFunction } from 'express';

import Product from '../../../lib/models/product';

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

    return res.status(200).json({ message: 'fetched product.', product });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
};
