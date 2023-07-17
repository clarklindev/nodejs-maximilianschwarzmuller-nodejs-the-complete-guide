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
router.delete('/cart-delete-item', cartDeleteProduct);
router.post('/create-order', postOrder);
router.get('/orders', getOrders);

export default router;
