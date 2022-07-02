const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");

const notificationController = require("../controllers/notification.controller");

router.get(
  "/detail/:notificationId",
  [passport.authenticate("jwt", { session: false })],
  notificationController.getNotificationById
);

router.put(
  "/read/:notificationId",
  notificationController.updateReadNotification
);

router.get(
  "/seller",
  [passport.authenticate("jwt", { session: false })],
  notificationController.getAllNotificationSeller
);

router.get(
  "/buyer",
  [passport.authenticate("jwt", { session: false })],
  notificationController.getAllNotificationBuyer
);

module.exports = router;
