import express from 'express';

import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
  deleteAllProducts,
} from '../controllers/products';
import { isAuth } from '../middleware/isAuth';

const router = express.Router();

router.get('/', isAuth, getProducts);
router.get('/:productId', isAuth, getProduct);

router.post('/', isAuth, addProduct);
router.put('/:productId', isAuth, editProduct);

router.delete('/:productId', isAuth, deleteProduct);
router.delete('/', isAuth, deleteAllProducts);

export default router;
