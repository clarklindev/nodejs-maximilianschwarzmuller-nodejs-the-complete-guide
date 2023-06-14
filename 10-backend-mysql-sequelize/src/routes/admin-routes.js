const express = require('express');
const adminController = require('../controllers/admin-controller');

const router = express.Router();

// GET PRODUCTS
router.get('/products', adminController.getProducts);

// CREATE PRODUCT
router.post('/add-product', adminController.postAddProduct);

// GET PRODUCT
router.get('/product/:productId', adminController.getEditProduct);

// UPDATE PRODUCT
router.post('/product/:productId', adminController.postEditProduct);

router.delete('/product/:productId', adminController.postDeleteProduct);
module.exports = router;
