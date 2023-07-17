import express from 'express';

import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
  deleteAllProducts,
} from '../controllers/products';
import { isAuth } from '../middleware/is-auth';

const router = express.Router();

router.get('/', getProducts);
router.get('/:productId', getProduct);

router.post('/', addProduct);
router.put('/:productId', editProduct);

router.delete('/:productId', deleteProduct);
router.delete('/', deleteAllProducts);

export default router;
