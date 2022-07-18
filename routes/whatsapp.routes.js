const express = require("express");
const router = express.Router();

const wa = require('../controllers/whatsapp.controller')
router.get('/:userId', wa.redirect)

module.exports = router;