import { Request, Response, NextFunction } from 'express';
import { IRequest } from '../../../lib/interfaces/IRequest';

import Order from '../../../lib/models/order';
import { CartItem } from '../../../lib/models/user';

export const postOrder = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const user = await req.user.populate('cart.items.productId');
    //SEE MODELS for order: order products has object: {product, quantity} props but cart stores {productId, quantity}
    const products = user.cart.items.map((item: CartItem) => {
      return { quantity: item.quantity, product: { ...item.productId } };
    });
    console.log('products:', products);
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user, //mongoose: here... gets id automatically from the object (user)
      },
      products,
    });
    const result = await order.save();
    await req.user.clearCart();
    return res.json({ result, products });
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};
