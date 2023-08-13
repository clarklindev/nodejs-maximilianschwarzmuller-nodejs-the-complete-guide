import { Request, Response, NextFunction } from 'express';

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      const user = await req.user.populate('cart.items.productId');
      if (user.cart) {
        const products = user.cart.items;
        res.json({ products });
      }
    }
  } catch (err) {
    console.log(err);
  }
};
