import express from 'express';

import {
  getProducts,
  getProduct,
  getCart,
  postCart,
  cartDeleteProduct,
  postOrder,
  getOrders,
  getInvoice,
} from '../controllers';

import { isAuth } from '../../../lib/middleware/isAuth';

const router = express.Router();

router.get('/', getProducts);
router.get('/:productId', getProduct);

router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postCart);
router.delete('/cart', isAuth, cartDeleteProduct);

router.post('/orders', isAuth, postOrder);
router.get('/orders', isAuth, getOrders);
router.get('/orders/:orderId', isAuth, getInvoice);

export default router;
