const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");

const transactionController = require("../controllers/transaction.controller");

router.post(
  "/create",
  [passport.authenticate("jwt", { session: false })],
  transactionController.createTransaction
);

module.exports = router;
