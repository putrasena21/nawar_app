const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");

const upload = require("../middlewares/upload.middleware");

const userController = require("../controllers/user.controller");

router.post("/register", userController.register);

router.get("/provinces", userController.getProvinces);
router.get("/provinces/:provinceId", userController.getCities);

router.get(
  "/profile",
  [passport.authenticate("jwt", { session: false })],
  userController.getProfile
);

router.put(
  "/profile",
  [passport.authenticate("jwt", { session: false })],
  upload.single("avatar"),
  userController.updateProfile
);
module.exports = router;
