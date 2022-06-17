const express = require('express');
const router = express.Router();

const category = require('../controllers/category.controller');

router.post('/', category.createCategory);
router.get('/', category.getAllCategory);

module.exports = router;