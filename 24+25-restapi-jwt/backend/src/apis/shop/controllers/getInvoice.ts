import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import Order from '../../../lib/models/order';
import { createInvoice } from '../../../lib/helpers/createInvoice';
import { IInvoice } from '../interfaces/IInvoice';

export const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
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
    const invoiceData: IInvoice = {
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
    //RECOMMENDED METHOD:
    //method 1 - createReadStream - piping read stream (file) into response
    const file = fs.createReadStream(invoicePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `${mode}; filename="${invoiceName}"`); //inline or attachment
    file.pipe(res);

    //method 2- readFile - Preloading data
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

    //--------------------------------------------------------------------------
  } catch (err) {
    next(err);
  }
};
