const express = require('express');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', adminController.getProducts);
router.get('/products/:productId', adminController.getProduct);

router.post('/add-product', adminController.addProduct);

router.put('/edit-product/:productId', adminController.editProduct);

// router.delete('/products/:productId', adminController.deleteProduct);

module.exports = router;
