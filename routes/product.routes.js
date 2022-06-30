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
router.post(
  "/draft",
  [passport.authenticate("jwt", { session: false })],
  userMiddleware.checkProfileCompleted,
  upload.array("images", 4),
  productController.createProductNoPublish
);

router.get(
  "/user",
  [passport.authenticate("jwt", { session: false })],
  productController.getAllproductByUser
);

router.get("/", productController.getAllProductPagination);
router.get("/:productId", productController.getProductById);

router.put(
  "/publish/:productId",
  [passport.authenticate("jwt", { session: false })],
  productController.publishProduct
);
router.put(
  "/:productId",
  [passport.authenticate("jwt", { session: false })],
  productController.updateProduct
);

router.delete(
  "/:productId",
  [passport.authenticate("jwt", { session: false })],
  productController.deleteProductById
);

module.exports = router;
