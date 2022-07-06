const express = require("express");

const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require("../middlewares/user.middleware");
const productController = require("../controllers/product.controller");

router.post(
  "/create",
  authMiddleware.userAuth,
  userMiddleware.checkProfileCompleted,
  upload.array("images", 4),
  productController.createProduct
);
router.post(
  "/draft",
  authMiddleware.userAuth,
  userMiddleware.checkProfileCompleted,
  upload.array("images", 4),
  productController.createProductNoPublish
);

router.get(
  "/user",
  authMiddleware.userAuth,
  productController.getAllProductByUser
);
router.get(
  "/user/sold",
  authMiddleware.userAuth,
  productController.getAllProductSoldByUser
);
router.get(
  "/user/draft",
  authMiddleware.userAuth,
  productController.getAllProductUnpublished
);
router.get("/filter/:categoryId", productController.getAllProductByCategory);
router.get("/:productId", productController.getProductById);
router.get("/", productController.getAllProductPublished);

router.put(
  "/publish/:productId",
  authMiddleware.userAuth,
  productController.publishProduct
);
router.put(
  "/:productId",
  authMiddleware.userAuth,
  productController.updateProduct
);

router.delete(
  "/:productId",
  authMiddleware.userAuth,
  productController.deleteProductById
);

module.exports = router;
