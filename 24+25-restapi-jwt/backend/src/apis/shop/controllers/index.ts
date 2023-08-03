import { NextFunction, Request, RequestHandler, Response } from 'express';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

import Product from '../../../global/models/product';
import Order from '../../../global/models/order';
import { CartItem } from '../../../global/models/user';
import { createInvoice } from '../../../global/helpers/createInvoice';
import { ErrorWithStatus } from '../../../global/interfaces/ErrorWithStatus';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

    return res.status(200).json({ message: 'fetched product.', product });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
};

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
    const loggedInUser = req.userId.toString(); //req.userId is available only if isAuth is executed

    //if the loggedin user is not the same as the person whose order it is...
    if (orderUser !== loggedInUser) {
      return next(new Error('Unorthorized to execute the operation'));
    }
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoiceName);

    //--------------------------------------------------------------------------
    //set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `${mode}; filename="${invoiceName}"`); //inline or attachment

    //generate pdf on the fly
    const invoiceData = {
      shipping: {
        name: 'John Doe',
        address: '1234 Main Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
        postal_code: 94111,
      },
      items: [
        {
          item: 'TC 100',
          description: 'Toner Cartridge',
          quantity: 2,
          amount: 6000,
        },
        {
          item: 'USB_EXT',
          description: 'USB Cable Extender',
          quantity: 1,
          amount: 2000,
        },
      ],
      subtotal: 8000,
      paid: 0,
      invoice_nr: 1234,
    };

    const pdf = createInvoice(invoiceData, invoicePath);
    pdf.pipe(res);

    //--------------------------------------------------------------------------
    //readFile Method - Preloading data
    //handle whole file, send when done
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader(
    //     'Content-Disposition',
    //     `${mode}; filename="${invoiceName}"`
    //   ); //inline or attachment

    //   res.send(data); //return buffer
    // });

    //RECOMMENDED METHOD: createReadStream Method - piping read stream (file) into response
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `${mode}; filename="${invoiceName}"`); //inline or attachment
    // file.pipe(res);
    //--------------------------------------------------------------------------
  } catch (err) {
    next(err);
  }
};

// export const getCheckout = async (req:Request, res:Response, next:NextFunction) => {};
