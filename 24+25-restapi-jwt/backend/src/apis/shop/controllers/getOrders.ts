import { Request, Response, NextFunction } from 'express';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   if (req.user) {
  //     const orders = await Order.find({ 'user.userId': req.user._id });
  //     res.json({ orders });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.json({ error: err });
  // }
};
