const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const notificationController = require("../controllers/notification.controller");

router.get(
  "/detail/:notificationId",
  authMiddleware.userAuth,
  notificationController.getNotificationById
);

router.put(
  "/read/:notificationId",
  authMiddleware.userAuth,
  notificationController.updateReadNotification
);

router.get(
  "/seller",
  authMiddleware.userAuth,
  notificationController.getAllNotificationSeller
);

router.get(
  "/buyer",
  authMiddleware.userAuth,
  notificationController.getAllNotificationBuyer
);

module.exports = router;
