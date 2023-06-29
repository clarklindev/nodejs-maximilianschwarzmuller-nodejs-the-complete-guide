const express = require('express');
const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/products', isAuth, adminController.getProducts);
router.get('/products/:productId', isAuth, adminController.getProduct);
router.post('/add-product', isAuth, adminController.addProduct);
router.put('/edit-product/:productId', isAuth, adminController.editProduct);
router.delete('/products/:productId', isAuth, adminController.deleteProduct);
module.exports = router;
