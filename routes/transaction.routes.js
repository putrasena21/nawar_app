const express = require("express");
const router = express.Router();
const passport = require("../lib/passport");

const transactionController = require('../controllers/transaction.controller');

router.post('/create', transactionController.createTransaction);
router.get('/get', transactionController.getAllTransaction);

router.get(
    '/get-detail/:id', 
    [passport.authenticate('jwt', {session: false})],
    transactionController.getDetailTransaction
)

router.get(
    '/history',
    [passport.authenticate('jwt', {session: false})],
    transactionController.history
)

module.exports = router;