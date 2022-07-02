const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");

const notificationController = require("../controllers/notification.controller");

router.get(
  "/detail/:notificationId",
  [passport.authenticate("jwt", { session: false })],
  notificationController.getNotificationById
);

router.get(
  "/",
  [passport.authenticate("jwt", { session: false })],
  notificationController.getAllNotification
);

module.exports = router;
