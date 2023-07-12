import express from 'express';

import {getProducts, getProduct, getIndex, getCart, postCart, cartDeleteProduct, postOrder, getOrders} from '../controllers/shop';
import {isAuth} from '../middleware/is-auth';

const router = express.Router();

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/products/:productId', getProduct);

router.get('/cart', isAuth, getCart);
router.post('/cart', isAuth, postCart);
router.delete('/cart-delete-item', isAuth, cartDeleteProduct);

router.post('/create-order', isAuth, postOrder);
router.get('/orders', isAuth, getOrders);

export default router;
