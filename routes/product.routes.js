const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const storage = require('../middlewares/storage.middleware');
const products = require('../controllers/product.controller');


router.get('/', products.getAllProduct);
router.post('/', upload.array('images', 4),products.createProduct);
// router.put('/:id', upload.array('images', 4), products.updateProductById);
router.get('/:id', products.getProductById);

module.exports = router;