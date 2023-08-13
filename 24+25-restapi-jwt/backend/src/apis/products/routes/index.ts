import express from 'express';

import { getProducts, getProduct, addProduct, editProduct, deleteProduct, deleteAllProducts } from '../controllers';
import { isAuth } from '../../../lib/middleware/isAuth';
import { validationSchema as ProductValidation } from './products.validation';
import { validateRequestData } from '../../../lib/middleware/validateRequestData';

const router = express.Router();

router.get('/', isAuth, getProducts);
router.get('/:productId', isAuth, getProduct);

router.post('/', isAuth, validateRequestData(ProductValidation), addProduct);
router.put('/:productId', isAuth, validateRequestData(ProductValidation), editProduct);

router.delete('/:productId', isAuth, deleteProduct);
router.delete('/', isAuth, deleteAllProducts);

export default router;
