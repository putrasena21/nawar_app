const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");

const transactionController = require("../controllers/transaction.controller");

router.post(
  "/create",
  [passport.authenticate("jwt", { session: false })],
  transactionController.createTransaction
);

router.get(
  "/get",
  [passport.authenticate("jwt", { session: false })],
  transactionController.getAllTransaction
);
router.get(
  "/detail/:transactionId",
  [passport.authenticate("jwt", { session: false })],
  transactionController.getDetailTransaction
);
router.get(
  "/history",
  [passport.authenticate("jwt", { session: false })],
  transactionController.history
);

module.exports = router;
