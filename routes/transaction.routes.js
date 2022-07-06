const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require("../middlewares/user.middleware");

const transactionController = require("../controllers/transaction.controller");

router.post(
  "/create",
  authMiddleware.userAuth,
  userMiddleware.checkProfileCompleted,
  transactionController.createTransaction
);

router.put(
  "/reject/:transactionId",
  authMiddleware.userAuth,
  transactionController.rejectTransaction
);
router.put("/accept/:transactionId", [
  authMiddleware.userAuth,
  transactionController.acceptTransaction,
]);
router.put(
  "/complete/:transactionId",
  authMiddleware.userAuth,
  transactionController.completeTransaction
);

module.exports = router;
