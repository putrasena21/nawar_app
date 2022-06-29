const express = require("express");
const router = express.Router();
const passport = require("../lib/passport");

const transactionController = require('../controllers/transaction.controller');

router.post('/create', transactionController.createTransaction);
router.get('/get', transactionController.getAllTransaction);

router.get(
    '/get-detail', 
    [passport.authenticate('jwt', {session: false})],
    transactionController.getDetailTransaction
    )

module.exports = router;