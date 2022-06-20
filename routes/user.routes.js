const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");

const userController = require("../controllers/user.controller");

router.post("/register", userController.register);

router.get(
  "/profile",
  [passport.authenticate("jwt", { session: false })],
  userController.getProfile
);
module.exports = router;
