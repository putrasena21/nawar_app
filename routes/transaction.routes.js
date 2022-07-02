const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");

const transactionController = require("../controllers/transaction.controller");

router.post(
  "/create",
  [passport.authenticate("jwt", { session: false })],
  transactionController.createTransaction
);

router.put(
  "/reject/:transactionId",
  [passport.authenticate("jwt", { session: false })],
  transactionController.rejectTransaction
);
router.put("/accept/:transactionId", [
  passport.authenticate("jwt", { session: false }),
  transactionController.acceptTransaction,
]);
router.put(
  "/complete/:transactionId",
  passport.authenticate("jwt", { session: false }),
  transactionController.completeTransaction
);

module.exports = router;
