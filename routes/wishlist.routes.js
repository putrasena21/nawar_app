const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const wishlistController = require("../controllers/wishlist.controller");

router.post("/add", authMiddleware.userAuth, wishlistController.addWishlist);

router.get(
  "/detail/:wishlistId",
  authMiddleware.userAuth,
  wishlistController.getDetail
);
router.get("/", authMiddleware.userAuth, wishlistController.getWishlist);

router.put("/update/:id", wishlistController.updateWishlist);

router.delete(
  "/delete/:wishlistId",
  authMiddleware.userAuth,
  wishlistController.deleteWishlist
);

module.exports = router;
