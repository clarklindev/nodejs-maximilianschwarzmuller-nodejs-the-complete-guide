import express from 'express';

import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
} from '../controllers/admin';
import { body } from 'express-validator';
import { isAuth } from '../middleware/is-auth';

const validateAddProduct = [
  body('title').isString().isLength({ min: 3 }).trim(),
  // body('imageUrl').isURL(),
  body('price').isFloat(),
  body('description').isLength({ min: 5, max: 200 }).trim(),
];

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:productId', getProduct);

router.post('/add-product', validateAddProduct, addProduct);
router.put('/edit-product/:productId', editProduct);
router.delete('/products/:productId', deleteProduct);

export default router;
