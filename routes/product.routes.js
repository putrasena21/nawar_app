const express = require("express");

const router = express.Router();
const passport = require("../lib/passport");
const upload = require("../middlewares/upload.middleware");
const userMiddleware = require("../middlewares/user.middleware");
const productController = require("../controllers/product.controller");

router.post(
  "/create",
  [passport.authenticate("jwt", { session: false })],
  userMiddleware.checkProfileCompleted,
  upload.array("images", 4),
  productController.createProduct
);

router.get("/", productController.getAllProduct);
router.get("/all", productController.getProductAll);
router.get("/:id", productController.getProductById);
// router.get("/category/:categoryId", productController.getProductByCategory);

module.exports = router;
