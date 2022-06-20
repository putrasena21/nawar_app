const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");
const upload = require("../middlewares/upload.middleware");
const productController = require("../controllers/product.controller");

router.post(
  "/create",
  [passport.authenticate("jwt", { session: false })],
  upload.array("images", 4),
  productController.createProduct
);

module.exports = router;
