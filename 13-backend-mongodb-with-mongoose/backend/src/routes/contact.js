const express = require('express');
const contactController = require('../controllers/contact');

const router = express.Router();

router.post('/contacts', contactController.createContact);
router.get('/contacts/:id', contactController.getContact);
router.patch('/contacts/:id', contactController.updateContact);
router.delete('/contacts/:id', contactController.deleteContact);
module.exports = router;
