import { NextFunction, Request, RequestHandler, Response } from 'express';
import fs from 'fs';
import path from 'path';

import Product from '../../../global/models/product';
import Order from '../../../global/models/order';
import { CartItem } from '../../../global/models/user';
import { IRequest } from '../../../global/interfaces/IRequest';

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

export const getInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.orderId;

  let mode: string;
  if (req.query.mode === 'view') {
    mode = 'inline';
  }
  if (req.query.mode === 'download' || req.query.mode === undefined) {
    mode = 'attachment';
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new Error('No order found'));
    }

    const orderUser = order.user.userId.toString();
    const loggedInUser = req.userId.toString();

    if (orderUser !== loggedInUser) {
      return next(new Error('Unorthorized to execute the operation'));
    }
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoiceName);

    fs.readFile(invoicePath, (err, data) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${mode}; filename="${invoiceName}"`
      ); //inline or attachment

      res.send(data); //return buffer
    });
  } catch (err) {
    next(err);
  }
};

// export const getCheckout = async (req:Request, res:Response, next:NextFunction) => {};
