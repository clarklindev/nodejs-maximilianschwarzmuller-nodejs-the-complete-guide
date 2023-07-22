import express from 'express';

import {
  getCart,
  postCart,
  cartDeleteProduct,
  postOrder,
  getOrders,
} from '../controllers/shop';

const router = express.Router();

router.get('/cart', getCart);
router.post('/cart', postCart);
router.delete('/cart', cartDeleteProduct);

router.post('/order', postOrder);
router.get('/orders', getOrders);
// router.get('/orders/:orderId', getOrder);
export default router;
