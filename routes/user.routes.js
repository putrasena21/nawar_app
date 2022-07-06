const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

const userController = require("../controllers/user.controller");

router.post("/register", userController.register);

router.get("/provinces", userController.getProvinces);
router.get("/provinces/:provinceId", userController.getCities);

router.get("/profile", authMiddleware.userAuth, userController.getProfile);

router.put(
  "/profile",
  authMiddleware.userAuth,
  upload.single("avatar"),
  userController.updateProfile
);
module.exports = router;
