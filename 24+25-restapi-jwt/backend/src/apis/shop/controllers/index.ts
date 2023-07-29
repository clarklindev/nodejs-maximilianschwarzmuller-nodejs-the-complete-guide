import { NextFunction, Request, RequestHandler, Response } from 'express';

import Product from '../../../global/models/product';
import Order from '../../../global/models/order';
import { CartItem } from '../../../global/models/user';

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   if (req.user) {
  //     const user = await req.user.populate('cart.items.productId');
  //     if (user.cart) {
  //       const products = user.cart.items;
  //       res.json({ products });
  //     }
  //   }
  // } catch (err) {
  //   console.log(err);
  // }
};

// //for adding new products to cart
export const postCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const prodId = req.body.productId;
  // try {
  //   const product = await Product.findById(prodId);
  //   if (req.user) {
  //     const result = await req.user.addToCart(product);
  //     res.json({ result });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.json({ error: err });
  // }
};

export const cartDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const prodId = req.body.productId;
  // try {
  //   const result = await req.user.deleteFromCart(prodId);
  //   res.json({ result });
  // } catch (err) {
  //   console.log(err);
  // }
};

export const postOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const user = await req.user.populate('cart.items.productId');
  //   //SEE MODELS for order: order products has object: {product, quantity} props but cart stores {productId, quantity}
  //   const products = user.cart.items.map((item: CartItem) => {
  //     return { quantity: item.quantity, product: { ...item.productId } };
  //   });
  //   console.log('products:', products);
  //   const order = new Order({
  //     user: {
  //       email: req.user.email,
  //       userId: req.user, //mongoose: here... gets id automatically from the object (user)
  //     },
  //     products,
  //   });
  //   const result = await order.save();
  //   await req.user.clearCart();
  //   return res.json({ result, products });
  // } catch (err) {
  //   console.log(err);
  //   return res.json({ error: err });
  // }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

// export const getCheckout = async (req:Request, res:Response, next:NextFunction) => {};
